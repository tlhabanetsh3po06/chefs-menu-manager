import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { StatusBar } from 'expo-status-bar';

const COURSES = ['Starter', 'Main Course', 'Dessert'];

export default function App() {
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState(COURSES[0]);
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState({});
  const [menuItems, setMenuItems] = useState([]);

  const validate = () => {
    const newErrors = {};
    if (!dishName.trim()) newErrors.dishName = 'Dish name is required.';
    if (!description.trim()) newErrors.description = 'Description is required.';
    if (!price.trim()) {
      newErrors.price = 'Price is required.';
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = 'Please enter a valid price.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddItem = () => {
    if (!validate()) return;

    const newItem = {
      id: Date.now().toString(),
      dishName: dishName.trim(),
      description: description.trim(),
      course,
      price: Number(price).toFixed(2),
    };

    setMenuItems((prevItems) => [...prevItems, newItem]);
    setDishName('');
    setDescription('');
    setCourse(COURSES[0]);
    setPrice('');
    setErrors({});
    Alert.alert('Success', 'Menu item added successfully.');
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.dishName}>{item.dishName}</Text>
        <Text style={styles.price}>R{item.price}</Text>
      </View>
      <Text style={styles.course}>{item.course}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Chef's Menu Manager</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Dish Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Grilled Salmon"
              value={dishName}
              onChangeText={setDishName}
            />
            {errors.dishName ? (
              <Text style={styles.errorText}>{errors.dishName}</Text>
            ) : null}

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Describe the dish"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />
            {errors.description ? (
              <Text style={styles.errorText}>{errors.description}</Text>
            ) : null}

            <Text style={styles.label}>Course</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={course}
                onValueChange={(value) => setCourse(value)}
              >
                {COURSES.map((c) => (
                  <Picker.Item key={c} label={c} value={c} />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 150"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
            {errors.price ? (
              <Text style={styles.errorText}>{errors.price}</Text>
            ) : null}

            <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
              <Text style={styles.addButtonText}>Add Menu Item</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.listSection}>
            <Text style={styles.sectionTitle}>Menu Items</Text>
            {menuItems.length === 0 ? (
              <Text style={styles.emptyText}>
                No menu items have been added yet.
              </Text>
            ) : (
              <FlatList
                data={menuItems}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                scrollEnabled={false}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F4EF',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2E2A26',
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3A3530',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D8D2C9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#2E2A26',
    backgroundColor: '#FCFBF9',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#D8D2C9',
    borderRadius: 8,
    backgroundColor: '#FCFBF9',
    overflow: 'hidden',
  },
  errorText: {
    color: '#B3261E',
    fontSize: 13,
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#B5651D',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  listSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E2A26',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 15,
    color: '#6B6459',
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EDE8E0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dishName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2E2A26',
    flexShrink: 1,
    marginRight: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#B5651D',
  },
  course: {
    fontSize: 13,
    color: '#8A5A2B',
    marginTop: 4,
    marginBottom: 6,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#4A453F',
    lineHeight: 20,
  },
});
