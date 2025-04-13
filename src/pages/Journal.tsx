import React, { useState, useEffect } from "react";
import {
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import "./Journal.css";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  userId: string;
}

const Journal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState({ title: "", content: "" });
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Get current user
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
    setCurrentUser(user);

    // Get all entries and filter for current user
    const savedEntries = localStorage.getItem("journalEntries");
    if (savedEntries) {
      const allEntries = JSON.parse(savedEntries);
      const userEntries = allEntries.filter(
        (entry: JournalEntry) => entry.userId === user.id
      );
      setEntries(userEntries);
    }
  }, []);

  const saveEntries = (newEntry: JournalEntry) => {
    // Get all existing entries
    const allEntries = JSON.parse(
      localStorage.getItem("journalEntries") || "[]"
    );

    // Add new entry
    const updatedEntries = [newEntry, ...allEntries];

    // Save all entries back to localStorage
    localStorage.setItem("journalEntries", JSON.stringify(updatedEntries));

    // Update state with only user's entries
    const userEntries = updatedEntries.filter(
      (entry) => entry.userId === currentUser.id
    );
    setEntries(userEntries);
  };

  const handleAddEntry = () => {
    if (newEntry.title.trim() && newEntry.content.trim() && currentUser) {
      const entry: JournalEntry = {
        id: Date.now().toString(),
        title: newEntry.title,
        content: newEntry.content,
        date: new Date().toLocaleDateString(),
        userId: currentUser.id,
      };

      saveEntries(entry);
      setNewEntry({ title: "", content: "" });
      setShowAddForm(false);
    }
  };

  const handleDeleteEntry = (id: string) => {
    // Get all entries
    const allEntries = JSON.parse(
      localStorage.getItem("journalEntries") || "[]"
    );
    // Remove the entry
    const updatedAllEntries = allEntries.filter(
      (entry: JournalEntry) => entry.id !== id
    );
    // Save back to localStorage
    localStorage.setItem("journalEntries", JSON.stringify(updatedAllEntries));
    // Update state with filtered user entries
    const userEntries = updatedAllEntries.filter(
      (entry: JournalEntry) => entry.userId === currentUser.id
    );
    setEntries(userEntries);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Journal</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {!showAddForm ? (
          <IonButton expand="block" onClick={() => setShowAddForm(true)}>
            Add New Entry
          </IonButton>
        ) : (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>New Entry</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem>
                <IonLabel position="floating">Title</IonLabel>
                <IonInput
                  value={newEntry.title}
                  onIonChange={(e) =>
                    setNewEntry({ ...newEntry, title: e.detail.value! })
                  }
                />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Content</IonLabel>
                <IonTextarea
                  value={newEntry.content}
                  onIonChange={(e) =>
                    setNewEntry({ ...newEntry, content: e.detail.value! })
                  }
                  rows={6}
                />
              </IonItem>
              <IonButton
                expand="block"
                onClick={handleAddEntry}
                style={{ marginTop: "1rem" }}
              >
                Save Entry
              </IonButton>
              <IonButton
                expand="block"
                color="medium"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}

        <IonList>
          {entries.map((entry) => (
            <IonCard key={entry.id}>
              <IonCardHeader>
                <IonCardTitle>{entry.title}</IonCardTitle>
                <IonLabel color="medium">{entry.date}</IonLabel>
              </IonCardHeader>
              <IonCardContent>
                <p>{entry.content}</p>
                <IonButton
                  color="danger"
                  fill="clear"
                  onClick={() => handleDeleteEntry(entry.id)}
                >
                  Delete
                </IonButton>
              </IonCardContent>
            </IonCard>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Journal;
