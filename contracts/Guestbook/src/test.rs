#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::EnvTestConfig, Env, String};

#[test]
fn test_add_and_get_messages() {
    let env = Env::default();
    let contract_id = env.register(GuestbookContract, ());
    let client = GuestbookContractClient::new(&env, &contract_id);

    // Initially empty
    assert_eq!(client.message_count(), 0);

    // Add a message
    let result = client.add_message(
        &String::from_str(&env, "Alice"),
        &String::from_str(&env, "Hello from the guestbook!"),
    );
    assert_eq!(result, String::from_str(&env, "Message added to guestbook!"));

    // Count should be 1
    assert_eq!(client.message_count(), 1);

    // Retrieve messages
    let messages = client.get_messages();
    assert_eq!(messages.len(), 1);
    assert_eq!(messages.get(0).unwrap().author, String::from_str(&env, "Alice"));
    assert_eq!(messages.get(0).unwrap().likes, 0);
}

#[test]
fn test_like_message() {
    let env = Env::default();
    let contract_id = env.register(GuestbookContract, ());
    let client = GuestbookContractClient::new(&env, &contract_id);

    client.add_message(
        &String::from_str(&env, "Bob"),
        &String::from_str(&env, "Soroban is awesome!"),
    );

    let messages = client.get_messages();
    let id = messages.get(0).unwrap().id;

    // Like the message
    let result = client.like_message(&id);
    assert_eq!(result, String::from_str(&env, "Liked!"));

    // Verify likes incremented
    let updated = client.get_messages();
    assert_eq!(updated.get(0).unwrap().likes, 1);
}

#[test]
fn test_delete_message() {
    let env = Env::default();
    let contract_id = env.register(GuestbookContract, ());
    let client = GuestbookContractClient::new(&env, &contract_id);

    client.add_message(
        &String::from_str(&env, "Charlie"),
        &String::from_str(&env, "Will be deleted"),
    );

    let messages = client.get_messages();
    let id = messages.get(0).unwrap().id;

    // Delete it
    let result = client.delete_message(&id);
    assert_eq!(result, String::from_str(&env, "Message deleted."));

    // Should be empty again
    assert_eq!(client.message_count(), 0);
}

#[test]
fn test_like_nonexistent_message() {
    let env = Env::default();
    let contract_id = env.register(GuestbookContract, ());
    let client = GuestbookContractClient::new(&env, &contract_id);

    let result = client.like_message(&9999999u64);
    assert_eq!(result, String::from_str(&env, "Message not found"));
}
