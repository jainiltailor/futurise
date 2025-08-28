
"use client"

import { app } from "@/lib/firebase"
import { getAuth, type User } from "firebase/auth"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"

// This is a mock user type that is compatible with Firebase's User type
type MockUser = Pick<User, "uid" | "displayName" | "email" | "photoURL">;

// We will use local storage to persist the mock user session
const MOCK_USER_STORAGE_KEY = "firebase_mock_user";

// This is a mock of the auth object. We don't need the real one for the bypass.
export const auth = getAuth(app)

export function useUser() {
  const [user, setUser] = useState<MockUser | null | undefined>(undefined) // undefined means loading

  useEffect(() => {
    // On initial load, check local storage for a mock user
    try {
      const storedUser = localStorage.getItem(MOCK_USER_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    }
  }, [])
  
  // This effect listens for changes in local storage from other tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === MOCK_USER_STORAGE_KEY) {
            try {
                if(event.newValue) {
                    setUser(JSON.parse(event.newValue));
                } else {
                    setUser(null);
                }
            } catch (error) {
                setUser(null);
            }
        }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => {
        window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return user
}

export async function signInWithGoogle() {
  try {
    // Create a static mock user
    const mockUser: MockUser = {
      uid: "mock-user-123",
      displayName: "Test User",
      email: "test.user@example.com",
      photoURL: "https://github.com/shadcn.png"
    };

    // Store the mock user in local storage to simulate a session
    localStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify(mockUser));
    
    // Dispatch a storage event to notify other tabs/windows
    window.dispatchEvent(new StorageEvent('storage', {
        key: MOCK_USER_STORAGE_KEY,
        newValue: JSON.stringify(mockUser),
    }));

    return true
  } catch (error) {
    console.error("Mock sign-in error:", error)
    return false
  }
}

export async function signOut() {
  try {
    // Remove the mock user from local storage
    localStorage.removeItem(MOCK_USER_STORAGE_KEY);
    
    // Dispatch a storage event to notify other tabs/windows
    window.dispatchEvent(new StorageEvent('storage', {
        key: MOCK_USER_STORAGE_KEY,
        newValue: null,
    }));

  } catch (error) {
    console.error("Mock sign out error:", error)
  }
}
