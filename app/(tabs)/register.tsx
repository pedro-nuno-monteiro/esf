import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import MyInput from '@/components/MyInput';
import DropDownPicker from 'react-native-dropdown-picker';

const RegisterScreen = () => {
  
  const [userType, setUserType] = useState('engineer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Engineer 
  const [fullName, setFullName] = useState('');
  const [oeNumber, setOeNumber] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [institution, setInstitution] = useState('');
  const [isStudent, setIsStudent] = useState('no');
  const [expertise, setExpertise] = useState('');
  const [phone, setPhone] = useState('');

  // ONG
  const [orgName, setOrgName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [address, setAddress] = useState('');
  const [activities, setActivities] = useState('');

  const [isStudentOpen, setIsStudentOpen] = useState(false);
  const [userTypeOpen, setUserTypeOpen] = useState(false);

  const auth = FIREBASE_AUTH;
  const router = useRouter();

  useEffect(() => {
    // Reset all form fields
    setUserType('engineer');
    setEmail('');
    setPassword('');
    
    // Engineer fields
    setFullName('');
    setOeNumber('');
    setSpecialty('');
    setInstitution('');
    setIsStudent('no');
    setExpertise('');
    setPhone('');
    
    // Organization fields
    setOrgName('');
    setTaxId('');
    setAddress('');
    setActivities('');
    
    // Reset dropdowns
    setIsStudentOpen(false);
    setUserTypeOpen(false);
  }, []); // Empty dependency array means this runs once when component mounts

  const signUp = async () => {
    setLoading(true);
    try {
      // authenticate
      const response = await createUserWithEmailAndPassword(auth, email, password);
      const userId = response.user.uid;
      
      // add user details
      await addUserDetails(userId);
      
      // add user type reference
      await setDoc(doc(FIREBASE_DB, 'userTypes', userId), {
        type: userType,
        email: email,
        createdAt: new Date().toISOString()
      });
      
      alert('Registration successful!');
      router.push('/login');
      
    } catch (error: any) {
      console.error(error);
      alert('Registration failed: ' + error.message);
    }
    setLoading(false);
  }

  const addUserDetails = async (userId: string) => {
    try {
      const userData = userType === 'engineer' ? {
        expertise,
        fullName,
        institution,
        isStudent,
        oeNumber,
        phone,
        specialty,
        email,
        status: 'pending',
        userId: userId,  // Add reference to auth user
        createdAt: new Date().toISOString(),
      } : {
        orgName,
        taxId,
        email,
        address,
        activities,
        phone,
        userId: userId,  // Add reference to auth user
        createdAt: new Date().toISOString()
      };

      const collectionName = userType === 'engineer' ? 'users' : 'ongs';
      await setDoc(doc(FIREBASE_DB, collectionName, userId), userData);

    } catch (error: any) {
      console.error('Error adding user details:', error);
      throw error;
    }
  }

  const renderEngineerFields = () => (
    <>
      <MyInput
        value={fullName}
        onChangeText={setFullName}
        placeholder='Nome Completo'
      />
      <MyInput
        value={oeNumber}
        onChangeText={setOeNumber}
        placeholder='Número OE'
      />
      <MyInput
        value={specialty}
        onChangeText={setSpecialty}
        placeholder='Especialidade'
      />
      <MyInput
        value={institution}
        onChangeText={setInstitution}
        placeholder='Instituto de Ensino'
      />
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>É estudante?</Text>
        <DropDownPicker
          open={isStudentOpen}
          setOpen={setIsStudentOpen}
          value={isStudent}
          setValue={setIsStudent}
          items={[
            { label: 'Não', value: 'no' },
            { label: 'Sim', value: 'yes' }
          ]}
          style={styles.picker}
        />
      </View>
      <MyInput
        value={expertise}
        onChangeText={setExpertise}
        placeholder='Área de especialidade'
      />
    </>
  );

  const renderOrganizationFields = () => (
    <>
      <MyInput
        value={orgName}
        onChangeText={setOrgName}
        placeholder='Nome ONG'
      />
      <MyInput
        value={taxId}
        onChangeText={setTaxId}
        placeholder='NIF'
      />
      <MyInput
        value={address}
        onChangeText={setAddress}
        placeholder='Morada'
      />
      <MyInput
        value={activities}
        onChangeText={setActivities}
        placeholder='Descrição de atividades'
        multiline
        numberOfLines={3}
        style={styles.multilineInput}
      />
    </>
  );

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Image
          source={require('@/assets/images/logo_esf.svg')}
          style={styles.reactLogo}
        />
        
        <View style={styles.content}>
          <Text style={styles.title}>Registo</Text>
          
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Registar como:</Text>
            <DropDownPicker
              open={userTypeOpen}
              setOpen={setUserTypeOpen}
              value={userType}
              setValue={setUserType}
              items={[
                { label: 'Engenheiro', value: 'engineer' },
                { label: 'Organização', value: 'organization' }
              ]}
              style={styles.picker}
              zIndex={3000}
            />
          </View>

          {userType && (
            <>
              {userType === 'engineer' ? renderEngineerFields() : renderOrganizationFields()}

              <MyInput
                value={email}
                onChangeText={setEmail}
                placeholder='Email'
                keyboardType='email-address'
              />
              <MyInput
                value={password}
                onChangeText={setPassword}
                placeholder='Password'
                secureTextEntry
              />
              <MyInput
                value={phone}
                onChangeText={setPhone}
                placeholder='Telemóvel (Opcional)'
                keyboardType='phone-pad'
              />

              {loading ? (
                <ActivityIndicator size='large' color='#023E8A'/>
              ) : (
                <TouchableOpacity onPress={signUp}>
                  <View style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>Register</Text>
                  </View>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingBottom: 40,
  },
  reactLogo: {
    marginTop: 20,
    height: 300,
    width: 300,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  content: {
    width: '80%',
    alignItems: 'center',
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  picker: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(2, 62, 138, 0.1)',
    borderRadius: 10,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  loginButton: {
    marginTop: 30,
    width: 314,
    height: 60,
    backgroundColor: "#023E8A",
    borderRadius: 10,
  },
  loginButtonText: {
    fontSize: 30,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    lineHeight: 60,
  },
});

export default RegisterScreen;