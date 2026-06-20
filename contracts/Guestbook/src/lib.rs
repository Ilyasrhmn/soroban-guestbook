#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Env, String, Symbol, Vec};

// Struktur data untuk setiap pesan di guestbook
#[contracttype]
#[derive(Clone, Debug)]
pub struct GuestMessage {
    id: u64,
    author: String,
    message: String,
    likes: u64,
}

// Storage key
const GUEST_DATA: Symbol = symbol_short!("GUESTDATA");

#[contract]
pub struct GuestbookContract;

#[contractimpl]
impl GuestbookContract {
    // Ambil semua pesan dari guestbook
    pub fn get_messages(env: Env) -> Vec<GuestMessage> {
        env.storage().instance().get(&GUEST_DATA).unwrap_or(Vec::new(&env))
    }

    // Tambah pesan baru ke guestbook
    pub fn add_message(env: Env, author: String, message: String) -> String {
        let mut messages: Vec<GuestMessage> = env
            .storage()
            .instance()
            .get(&GUEST_DATA)
            .unwrap_or(Vec::new(&env));

        let entry = GuestMessage {
            id: env.prng().gen::<u64>(),
            author,
            message,
            likes: 0,
        };

        messages.push_back(entry);
        env.storage().instance().set(&GUEST_DATA, &messages);

        String::from_str(&env, "Message added to guestbook!")
    }

    // Like sebuah pesan berdasarkan id
    pub fn like_message(env: Env, id: u64) -> String {
        let mut messages: Vec<GuestMessage> = env
            .storage()
            .instance()
            .get(&GUEST_DATA)
            .unwrap_or(Vec::new(&env));

        for i in 0..messages.len() {
            let mut entry = messages.get(i).unwrap();
            if entry.id == id {
                entry.likes += 1;
                messages.set(i, entry);
                env.storage().instance().set(&GUEST_DATA, &messages);
                return String::from_str(&env, "Liked!");
            }
        }

        String::from_str(&env, "Message not found")
    }

    // Hapus pesan berdasarkan id
    pub fn delete_message(env: Env, id: u64) -> String {
        let mut messages: Vec<GuestMessage> = env
            .storage()
            .instance()
            .get(&GUEST_DATA)
            .unwrap_or(Vec::new(&env));

        for i in 0..messages.len() {
            if messages.get(i).unwrap().id == id {
                messages.remove(i);
                env.storage().instance().set(&GUEST_DATA, &messages);
                return String::from_str(&env, "Message deleted.");
            }
        }

        String::from_str(&env, "Message not found")
    }

    // Hitung total pesan yang ada
    pub fn message_count(env: Env) -> u32 {
        let messages: Vec<GuestMessage> = env
            .storage()
            .instance()
            .get(&GUEST_DATA)
            .unwrap_or(Vec::new(&env));

        messages.len()
    }
}

mod test;