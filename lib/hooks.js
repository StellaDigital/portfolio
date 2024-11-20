import { auth, firestore } from '@lib/firebase';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

// Custom hook to read  auth record and user profile doc
export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;

    if (user) {
      const ref = firestore.collection('users').doc(user.uid);
      unsubscribe = ref.onSnapshot((doc) => {
        setUsername(doc.data()?.username);
      });
    } else {
      setUsername(null);
    }

    return unsubscribe;
  }, [user]);

  return { user, username };
}

/*
export function useViewportValue(element) {
  const rect = element.getBoundingClientRect();
  if(rect){

    const elementHeight = element.offsetHeight
    const elementTopOfPage = element.offsetTop + element.offsetHeight
    let value = Math.abs(rect.top) / elementTopOfPage

    if(rect.top <= 0 && rect.top > (elementHeight * -1)){
      if(value >= 0 && value <= 1){
        return {
          values: value
        }
      }
    }else if(value => 1){
      return {
        values: 1
      }
    }else{
      return {
        values: 0
      }
    }

  }
}
*/