'use client';

import {useEffect, useState} from 'react';
import axios from 'axios';
import { Skeleton } from '@/components/ui/skeleton';

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}
 
export default function Page() { 

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await axios(
        'http://localhost:3001/users',
      );

      console.log('result', result);

      if (result.request.status !== 200) {
        return console.error('Error fetching data');
      }
      setUsers(result.data);
      setLoading(false);
    }
    fetchData();
  }, [])

  return (
    <div id="page">
      {loading ? <Skeleton /> : 
        users.length === 0 ? <p>No users found</p> : (
          users.map(user => (
            <div key={user.id}>
              <h2>{user.firstName} {user.lastName}</h2>
              <p>{user.email}</p>
            </div>
          ))
        )
      }
    </div>
  )
}