/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import ReactNativeBiometrics from 'react-native-biometrics';
import AsyncStorage from '@react-native-async-storage/async-storage';
let epochTimeSeconds = Math.round(new Date().getTime() / 1000).toString();
let payload = epochTimeSeconds + 'some message';

import {SafeAreaView, StyleSheet, Text, TouchableOpacity} from 'react-native';

const App = () => {

  const [sig,setSig] = useState('')

  const _storeData = async data => {
    try {
      await AsyncStorage.setItem('@Signature:key', data);
    } catch (error) {
      // Error saving data
    }
  };

  React.useEffect(() => {
    const isSensorAvailable = async () => {
      try {
        const biometryType = await ReactNativeBiometrics.isSensorAvailable();
        console.log('biometryType = ', biometryType);
        if (biometryType.available) {
          const keys = await ReactNativeBiometrics.biometricKeysExist();
          console.log(keys);
          if (!keys.keysExist) {
            const generatedKeys = await ReactNativeBiometrics.createKeys(
              'Confirm fingerprint',
            );
            console.log(generatedKeys);
          } else {
            const signature = await ReactNativeBiometrics.createSignature({
              promptMessage: 'Sign in',
              payload: payload,
            });
            console.log(signature);
            setSig(signature.signature)
            _storeData(signature.signature);
            if (signature.success) {
              // const promptResult = await ReactNativeBiometrics.simplePrompt({
              //   promptMessage: 'Confirm fingerprint',
              // });
              // console.log(promptResult);
            }
          }
          //do something face id specific
        }
      } catch (e) {
        console.log('something failed, error = ', e);
      }

      // ReactNativeBiometrics.biometricKeysExist().then(resultObject => {
      //   const {keysExist} = resultObject;

      //   if (keysExist) {
      //     console.log('Keys exist');
      //   } else {
      //     console.log('Keys do not exist or were deleted');
      //   }
      // });
    };

    isSensorAvailable();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.buttonStyle}
        onPress={async () => {
          const promptResult = await ReactNativeBiometrics.simplePrompt({
            promptMessage: 'Confirm fingerprint',
          });
          console.log(promptResult);
        }}>
        <Text style={styles.textStyle}>Authenticate</Text>
      </TouchableOpacity>
      <Text style={styles.biometryText}>{`signature is  ${sig}`}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonStyle: {
    width: '70%',
    backgroundColor: '#000',
    borderRadius: 25,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {color: '#fff', fontSize: 17, fontWeight: 'bold'},
  biometryText: {
    color: '#000',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 30,
  },
});

export default App;
