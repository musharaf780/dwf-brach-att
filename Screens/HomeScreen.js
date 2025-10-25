import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import {
  getAllStudents,
  insertStudent,
  updateStudentName,
} from '../DB/Database';

// Enable LayoutAnimation on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const HomeScreen = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🧠 Fetch students
  const fetchStudents = useCallback(() => {
    getAllStudents(
      results => setStudents(results),
      err => console.error('Error fetching students:', err),
    );
  }, []);

  // 🚀 Insert student
  const handleInsertStudent = useCallback(() => {
    setLoading(true);
    insertStudent(
      'John Doe',
      Math.floor(Math.random() * 10) + 18,
      () => {
        console.log('Student inserted successfully');
        fetchStudents(); // Refresh list once new student is inserted
        setLoading(false);
      },
      err => {
        console.error('Insert error:', err);
        setLoading(false);
      },
    );
  }, [fetchStudents]);

  // ✏️ Update record (no flicker)
  const handleUpdateStudent = useCallback(id => {
    setLoading(true);
    updateStudentName(
      id,
      'Musharaf Ahmed',
      () => {
        console.log('Student updated');
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        // ✅ Update only the changed record in local state (no flicker)
        setStudents(prev =>
          prev.map(item =>
            item.id === id ? { ...item, name: 'Musharaf Ahmed' } : item,
          ),
        );

        setLoading(false);
      },
      err => {
        console.error('Update failed:', err);
        setLoading(false);
      },
    );
  }, []);

  // 🧩 Fetch students on mount
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 10 }}>
        Student Records
      </Text>

      <Button
        title="Add Student"
        onPress={handleInsertStudent}
        disabled={loading}
      />

      {loading && (
        <ActivityIndicator
          size="large"
          color="#007bff"
          style={{ marginVertical: 15 }}
        />
      )}

      <FlatList
        data={students}
        keyExtractor={item => item.id.toString()}
        extraData={students}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: '#eee',
            }}
            onPress={() => handleUpdateStudent(item.id)}
          >
            <Text style={{ fontSize: 16, fontWeight: '500' }}>{item.name}</Text>
            <Text style={{ color: '#666', marginTop: 2 }}>Age: {item.age}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !loading && (
            <Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>
              No students found.
            </Text>
          )
        }
      />
    </View>
  );
};

export default HomeScreen;
