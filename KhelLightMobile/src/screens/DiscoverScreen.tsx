import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Platform, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { supabase } from '../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Profile: undefined;
  Discover: undefined;
  VideoGallery: { timeSlotId: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Sport = { id: string; name: string };
type Ground = { id: string; name: string };
type TimeSlot = { id: string; start_time: string; end_time: string };

export default function DiscoverScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [sports, setSports] = useState<Sport[]>([]);
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [selectedGround, setSelectedGround] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    setLoading(true);
    supabase.from('sports').select('id, name').then(({ data, error }) => {
      setLoading(false);
      if (error) Alert.alert('Error', error.message);
      else setSports(data || []);
    });
  }, []);

  useEffect(() => {
    if (!selectedSport) return setGrounds([]);
    setLoading(true);
    supabase.from('grounds').select('id, name').eq('sport_id', selectedSport).then(({ data, error }) => {
      setLoading(false);
      if (error) Alert.alert('Error', error.message);
      else setGrounds(data || []);
    });
    setSelectedGround('');
    setSelectedTimeSlot('');
  }, [selectedSport]);

  useEffect(() => {
    if (!selectedGround) return setTimeSlots([]);
    setLoading(true);
    // Always use localhost for iOS simulator
    const apiUrl = `http://localhost:8002/api/time-slots/${selectedGround}?date=${selectedDate}`;
    console.log('Fetching time slots from:', apiUrl);
    fetch(apiUrl)
      .then(res => res.json())
      .then(json => {
        setLoading(false);
        console.log('Fetched time slots response:', json);
        if (!json.success) {
          Alert.alert('Error', json.error || 'Failed to fetch time slots');
          setTimeSlots([]);
        } else {
          setTimeSlots(json.data || []);
        }
      })
      .catch(err => {
        setLoading(false);
        Alert.alert('Error', 'Could not connect to backend API');
        setTimeSlots([]);
      });
    setSelectedTimeSlot('');
  }, [selectedGround, selectedDate]);

  const handleTimeSlotSelect = (slotId: string) => {
    setSelectedTimeSlot(slotId);
    if (slotId) {
      navigation.navigate('VideoGallery', { timeSlotId: slotId });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#8B61C2" />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Discover</Text>
      <Text style={styles.subtitle}>Book a ground and watch highlights</Text>
      {loading && <ActivityIndicator size="large" color="#8B61C2" style={{ marginVertical: 20 }} />}
      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Select Sport</Text>
        <Picker
          selectedValue={selectedSport}
          onValueChange={setSelectedSport}
          style={styles.picker}
        >
          <Picker.Item label="Choose a sport..." value="" />
          {sports.map(s => (
            <Picker.Item key={s.id} label={s.name} value={s.id} />
          ))}
        </Picker>
      </View>
      {selectedSport ? (
        <View style={styles.dropdownContainer}>
          <Text style={styles.label}>Select Ground</Text>
          <Picker
            selectedValue={selectedGround}
            onValueChange={setSelectedGround}
            style={styles.picker}
          >
            <Picker.Item label="Choose a ground..." value="" />
            {grounds.map(g => (
              <Picker.Item key={g.id} label={g.name} value={g.id} />
            ))}
          </Picker>
        </View>
      ) : null}
      {selectedGround ? (
        <View style={styles.dropdownContainer}>
          <Text style={styles.label}>Select Date</Text>
          <TouchableOpacity
            style={styles.picker}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ padding: 12 }}>
              {new Date(selectedDate).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={new Date(selectedDate)}
              mode="date"
              display="default"
              onChange={(event: any, date: any) => {
                setShowDatePicker(false);
                if (date) setSelectedDate(date.toISOString().split('T')[0]);
              }}
            />
          )}
        </View>
      ) : null}
      {selectedGround ? (
        <View style={styles.dropdownContainer}>
          <Text style={styles.label}>Select Time Slot</Text>
          <Picker
            selectedValue={selectedTimeSlot}
            onValueChange={handleTimeSlotSelect}
            style={styles.picker}
          >
            <Picker.Item label="Choose a time slot..." value="" />
            {timeSlots.map(ts => {
              const start = new Date(ts.start_time);
              const end = new Date(ts.end_time);
              const label = `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
              return <Picker.Item key={ts.id} label={label} value={ts.id} />;
            })}
          </Picker>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingTop: 50, // Add padding for iPhone notch
    marginTop: 10, // Move down further
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#8B61C2',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
  },
  dropdownContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    marginLeft: 5,
  },
  picker: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginBottom: 5,
    width: '100%',
  },
});