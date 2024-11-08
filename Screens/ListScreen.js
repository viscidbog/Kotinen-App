import { app } from "../firebaseConfig";
import { getDatabase, ref, push, onValue } from "firebase/database";
import { StyleSheet, Text, View, Alert, FlatList, Button, TextInput } from "react-native";
import { useState, useEffect } from "react";

export default function List() {
  // Execute onValue inside the useEffect
  useEffect(() => {
    const itemsRef = ref(database, "items/");
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setItems(Object.values(data));
      } else {
        setItems([]); // Handle the case when there are no items
      }
    });
  }, []);

  const [product, setProduct] = useState({
    title: "",
    amount: "",
  });

  const [items, setItems] = useState([]);

  const database = getDatabase(app);

  const handleSave = () => {
    if (product.amount && product.title) {
      push(ref(database, "items/"), product);
    } else {
      Alert.alert("Error", "Type product and amount first");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Product title"
        onChangeText={(text) => setProduct({ ...product, title: text })}
        value={product.title}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        onChangeText={(text) => setProduct({ ...product, amount: text })}
        value={product.amount}
      />
      <Button onPress={handleSave} title="Save" />
      <FlatList
        renderItem={({ item }) => (
          <View style={styles.listcontainer}>
            <Text style={{ fontSize: 18 }}>
              {item.title}, {item.amount}
            </Text>
          </View>
        )}
        data={items}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingBottom: 10,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: 200,
    height: 40,
    borderWidth: 1,
    padding: 10,
    margin: 5,
  },
  listcontainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 5,
  },
});
