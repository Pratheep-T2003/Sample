import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Button,
  Provider as PaperProvider,
  Text,
  TextInput,
  Title,
} from 'react-native-paper';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [complaint, setComplaint] = useState('');
  const [users, setUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [showUserButton, setShowUserButton] = useState(true); // Controls toggle bar display
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [authMode, setAuthMode] = useState(''); // 'register' or 'login' in user flow

  const resetFields = () => {
    setName('');
    setMobile('');
    setPassword('');
    setDepartment('');
    setComplaint('');
  };

  // Custom Button with glow style
  const GlowButton = ({ title, onPress }) => (
    <Button
      mode="outlined"
      onPress={onPress}
      style={styles.glowButton}
      labelStyle={styles.buttonLabel}
    >
      {title}
    </Button>
  );

  // Navigation Bar
  const NavBar = () => (
    <View style={styles.navbarContainer}>
      <Text style={styles.navbarTitle}>RVS Groups</Text>
      <TouchableOpacity onPress={() => setToggle(!toggle)}>
        <Ionicons name="menu" size={28} color="#CCCCCC" />
      </TouchableOpacity>
    </View>
  );

  // Toggle menu
  const ToggleBar = () =>
    toggle ? (
      <View style={styles.toggleBar}>
        {showUserButton ? (
          <GlowButton
            title="User"
            onPress={() => {
              setShowUserButton(false);
              setScreen('userMenu'); // Or any other screen
            }}
          />
        ) : (
          <GlowButton
            title="Departments"
            onPress={() => {
              setShowUserButton(true);
              setScreen('departments');
            }}
          />
        )}
        {/* You can add other menu options here */}
        <GlowButton title="Admin" onPress={() => { setScreen('admin'); setToggle(false); }} />
      </View>
    ) : null;

  // Department Card
  const DepartmentCard = ({ title, onPress }) => (
    <TouchableOpacity style={styles.departmentCard} onPress={onPress}>
      <Text style={styles.departmentText}>{title}</Text>
    </TouchableOpacity>
  );

  // Screens
  const HomeScreen = () => (
    <View style={styles.screenContent}>
      <Title style={styles.title}>Welcome to RVS College of Arts and Science</Title>
      <Text style={styles.subtitle}>COMPLAINT MANAGEMENT SYSTEM</Text>
    </View>
  );

  const DepartmentsScreen = () => (
    <ScrollView contentContainerStyle={styles.screenContent}>
      <Title style={styles.title}>Departments</Title>
      {['MCA', 'B.Sc.IT', 'B.Sc.CS', 'BCA', 'M.Sc.CS'].map((dept) => (
        <DepartmentCard
          key={dept}
          title={dept}
          onPress={() => {
            setSelectedDepartment(dept);
            setScreen('departmentOptions');
          }}
        />
      ))}
    </ScrollView>
  );

  // Department Options: Register or Login
  const DepartmentOptionsScreen = () => (
    <View style={styles.screenContent}>
      <Text style={styles.title}>Department: {selectedDepartment}</Text>
      <GlowButton
        title="Register"
        onPress={() => {
          setAuthMode('register');
          setName('');
          setMobile('');
          setPassword('');
          setComplaint('');
          setScreen('userAuth');
        }}
      />
      <GlowButton
        title="Login"
        onPress={() => {
          setAuthMode('login');
          setName('');
          setMobile('');
          setPassword('');
          setComplaint('');
          setScreen('userAuth');
        }}
      />
      <GlowButton
        title="Back to Departments"
        onPress={() => setScreen('departments')}
      />
    </View>
  );

  // User Registration / Login Page
  const UserAuthPage = () => (
    <ScrollView contentContainerStyle={styles.screenContent}>
      <Text style={styles.title}>
        {authMode === 'register' ? 'Register' : 'Login'} - {selectedDepartment}
      </Text>
      {authMode === 'register' && (
        <>
          <TextInput label="Name" value={name} onChangeText={setName} style={styles.input} theme={inputTheme} />
          <TextInput label="Mobile" value={mobile} onChangeText={setMobile} keyboardType="number-pad" style={styles.input} theme={inputTheme} />
          <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} theme={inputTheme} />
        </>
      )}
      {authMode === 'login' && (
        <>
          <TextInput label="Mobile" value={mobile} onChangeText={setMobile} keyboardType="number-pad" style={styles.input} theme={inputTheme} />
          <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} theme={inputTheme} />
        </>
      )}
      <GlowButton
        title={authMode === 'register' ? 'Register' : 'Login'}
        onPress={() => {
          if (authMode === 'register') {
            if (name && mobile && password) {
              const user = {
                name,
                mobile,
                password,
                department: selectedDepartment,
              };
              setUsers([...users, user]);
              setLoggedInUser(user);
              resetFields();
              setScreen('user');
            } else {
              alert('Please fill all fields');
            }
          } else {
            const user = users.find(
              (u) => u.mobile === mobile && u.password === password && u.department === selectedDepartment
            );
            if (user) {
              setLoggedInUser(user);
              resetFields();
              setScreen('user');
            } else {
              alert('Invalid credentials');
            }
          }
        }}
      />
      <GlowButton
        title="Back"
        onPress={() => setScreen('departmentOptions')}
      />
    </ScrollView>
  );

  // User Screen
  const UserScreen = () => (
    <ScrollView contentContainerStyle={styles.screenContent}>
      {loggedInUser ? (
        <>
          <Text style={styles.title}>Welcome, {loggedInUser.name}</Text>
          <Text style={styles.subtitle}>Mobile: {loggedInUser.mobile}</Text>
          <Text style={styles.subtitle}>Department: {loggedInUser.department}</Text>
          <TextInput
            label="Your Complaint"
            value={complaint}
            onChangeText={setComplaint}
            multiline
            style={styles.input}
            theme={inputTheme}
          />
          <GlowButton
            title="Submit Complaint"
            onPress={() => {
              if (complaint) {
                setComplaints([
                  ...complaints,
                  {
                    name: loggedInUser.name,
                    mobile: loggedInUser.mobile,
                    department: loggedInUser.department,
                    text: complaint,
                    solved: false,
                  },
                ]);
                alert('Complaint submitted!');
                setComplaint('');
              } else {
                alert('Enter a complaint.');
              }
            }}
          />
          <GlowButton
            title="Logout"
            onPress={() => {
              setLoggedInUser(null);
              resetFields();
              setScreen('home');
            }}
          />
        </>
      ) : (
        <>
          <Text style={styles.title}>Please log in</Text>
          <TextInput label="Mobile" value={mobile} onChangeText={setMobile} style={styles.input} theme={inputTheme} />
          <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} theme={inputTheme} />
          <GlowButton
            title="Login"
            onPress={() => {
              const user = users.find(
                (u) => u.mobile === mobile && u.password === password
              );
              if (user) {
                setLoggedInUser(user);
                resetFields();
                setScreen('user');
              } else {
                alert('Invalid credentials');
              }
            }}
          />
          <GlowButton
            title="Back to Departments"
            onPress={() => setScreen('departments')}
          />
        </>
      )}
    </ScrollView>
  );

  const AdminScreen = () => (
    <ScrollView contentContainerStyle={styles.screenContent}>
      <Text style={styles.title}>Admin Login</Text>
      <TextInput label="Admin ID" value={mobile} onChangeText={setMobile} style={styles.input} theme={inputTheme} />
      <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} theme={inputTheme} />
      <GlowButton
        title="Login as Admin"
        onPress={() => {
          if (mobile === 'pratheep' && password === 'pratheep123') {
            setScreen('adminView');
            resetFields();
          } else {
            alert('Invalid admin credentials');
          }
        }}
      />
    </ScrollView>
  );

  const AdminView = () => {
    const totalRegistered = users.length;
    const totalComplaints = complaints.length;
    const solvedCount = complaints.filter(c => c.solved).length;
    const unsolvedCount = totalComplaints - solvedCount;

    // Data for summary table
    const summaryData = [
      { label: 'Registered Users', value: totalRegistered },
      { label: 'Total Complaints', value: totalComplaints },
      { label: 'Solved', value: solvedCount },
      { label: 'Unsolved', value: unsolvedCount },
    ];

    return (
      <ScrollView contentContainerStyle={styles.screenContent}>
        <Text style={styles.title}>Complaints Received</Text>
        {/* Summary table using column method */}
        <View style={styles.tableContainer}>
          {/* Table Header */}
          <View style={[styles.row, styles.headerRow]}>
            <View style={[styles.cell, styles.headerCell]}>
              <Text style={styles.headerText}>Category</Text>
            </View>
            <View style={[styles.cell, styles.headerCell]}>
              <Text style={styles.headerText}>Value</Text>
            </View>
          </View>
          {/* Table Rows */}
          {summaryData.map((item, index) => (
            <View key={index} style={styles.row}>
              <View style={styles.cell}><Text style={styles.cellText}>{item.label}</Text></View>
              <View style={styles.cell}><Text style={styles.cellText}>{item.value}</Text></View>
            </View>
          ))}
        </View>

        {/* Complaints Table */}
        <ComplaintsTable complaints={complaints} />
        <GlowButton title="Logout Admin" onPress={() => setScreen('admin')} />
      </ScrollView>
    );
  };

  // Complaints Table with column method
  const ComplaintsTable = ({ complaints }) => (
    <View style={styles.tableContainer}>
      {/* Table Header */}
      <View style={[styles.row, styles.headerRow]}>
        {['Name', 'Mobile', 'Dept', 'Complaint', 'Status', 'Action'].map((header, index) => (
          <View key={index} style={[styles.cell, styles.headerCell]}>
            <Text style={styles.headerText}>{header}</Text>
          </View>
        ))}
      </View>
      {/* Table Rows */}
      {complaints.length === 0 ? (
        <View style={styles.noDataRow}>
          <Text style={styles.noDataText}>No complaints submitted yet.</Text>
        </View>
      ) : (
        complaints.map((item, index) => (
          <View key={index} style={styles.row}>
            <View style={styles.cell}><Text style={styles.cellText}>{item.name}</Text></View>
            <View style={styles.cell}><Text style={styles.cellText}>{item.mobile}</Text></View>
            <View style={styles.cell}><Text style={styles.cellText}>{item.department}</Text></View>
            <View style={styles.cell}><Text style={styles.cellText}>{item.text}</Text></View>
            <View style={styles.cell}><Text style={styles.cellText}>{item.solved ? 'Solved' : 'Unsolved'}</Text></View>
            {!item.solved ? (
              <View style={styles.cell}>
                <GlowButton
                  title="Solve"
                  onPress={() => {
                    const newComplaints = [...complaints];
                    newComplaints[index] = { ...newComplaints[index], solved: true };
                    setComplaints(newComplaints);
                  }}
                />
              </View>
            ) : (
              <View style={styles.cell}><Text style={styles.cellText}>-</Text></View>
            )}
          </View>
        ))
      )}
    </View>
  );

  const screens = {
    home: HomeScreen,
    departments: DepartmentsScreen,
    departmentOptions: DepartmentOptionsScreen,
    userAuth: UserAuthPage,
    user: UserScreen,
    admin: AdminScreen,
    adminView: AdminView,
    userMenu: () => (
      <View style={styles.screenContent}>
        <Title style={styles.title}>User Options</Title>
        <GlowButton
          title="Register"
          onPress={() => {
            setAuthMode('register');
            setName('');
            setMobile('');
            setPassword('');
            setComplaint('');
            setSelectedDepartment('');
            setScreen('userAuth');
          }}
        />
        <GlowButton
          title="Login"
          onPress={() => {
            setAuthMode('login');
            setName('');
            setMobile('');
            setPassword('');
            setComplaint('');
            setSelectedDepartment('');
            setScreen('userAuth');
          }}
        />
        <GlowButton
          title="Back to Home"
          onPress={() => setScreen('home')}
        />
      </View>
    ),
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.appContainer}>
        <NavBar />
        <ToggleBar />
        {screens[screen] && screens[screen]()}
      </SafeAreaView>
    </PaperProvider>
  );
}

const inputTheme = {
  colors: {
    text: '#b575f9ff',
    primary: '#e9d5d5ff',
    placeholder: '#181919ff',
    background: '#70cce6ff',
  },
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#7e9ba4ff',
  },
  navbarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#e06c49ff',
    paddingTop: 40,
    paddingBottom: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  navbarTitle: {
    fontSize: 22,
    color: '#e9e4e4ff',
    fontWeight: 'bold', 
  },
  toggleBar: {
    backgroundColor: '#a7edc1ff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#6fec8aff',
  },
  screenContent: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingVertical: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    color: '#423f3fff',
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  subtitle: {
    color: '#543e3eff',
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    marginVertical: 10,
    backgroundColor: '#57c29ec0',
  },
  glowButton: {
    marginVertical: 8,
    paddingVertical: 8,
    borderColor: '#e85050ff',
    borderWidth: 2,
    borderRadius: 20,
    width: '90%',
    alignSelf: 'center',
  },
  buttonLabel: {
    color: '#794343ff',
    fontWeight: 'bold',
  },
  complaintBox: {
    backgroundColor: '#a1b3eaff',
    padding: 15,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#5cf8afff',
    borderRadius: 8,
    width: '100%',
  },
  complaintText: {
    color: '#08090fff',
    marginBottom: 5,
  },
  departmentCard: {
    width: '90%',
    backgroundColor: '#a15959ff',
    borderWidth: 2,
    borderColor: '#CCCCCC',
    padding: 15,
    marginVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  departmentText: {
    fontSize: 18,
    color: '#e4a3a3ff',
    fontWeight: 'bold',
  },
  summaryContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#149e5cff',
    borderRadius: 8,
    width: '100%',
  },
  tableContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 15,
  },
  row: {
    flexDirection: 'row',
  },
  headerRow: {
    backgroundColor: '#212737ff',
  },
  cell: {
    flex: 1,
    padding: 8,
    borderRightWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCell: {
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  cellText: {
    fontSize: 12,
  },
  noDataRow: {
    padding: 20,
    alignItems: 'center',
  },
  noDataText: {
    fontStyle: 'italic',
  },
});