import { useEffect, useRef, useState, useCallback, type FormEvent } from "react";
import { type GuestMessage } from "../bindings/index.ts";
import { connectFreighter, createContractClient } from "./stellar";
import gsap from "gsap";
import {
  BookOpen,
  Wallet,
  LogOut,
  RefreshCw,
  PenLine,
  Send,
  MessageSquare,
  Inbox,
  Trash2,
  AlertTriangle,
  Heart,
  Hash,
} from "lucide-react";

/* ─── helpers ─── */
function truncate(addr: string, head = 6, tail = 4) {
  if (addr.length <= head + tail + 3) return addr;
  return `${addr.slice(0, head)}…${addr.slice(-tail)}`;
}

/* ═══════════════════════════════════════════
   APP
   ═══════════════════════════════════════════ */
export default function App() {
  const [wallet, setWallet] = useState("");
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [messageCount, setMessageCount] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [likingId, setLikingId] = useState<bigint | null>(null);

  /* refs for GSAP */
  const headerRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  const fail = (err: unknown) =>
    setError(err instanceof Error ? err.message : "Something went wrong");

  /* ─── entrance animation ─── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // header
      tl.set(headerRef.current, { visibility: "visible" })
        .from(headerRef.current!.querySelector(".header__brand")!, {
          y: -20,
          opacity: 0,
          duration: 0.7,
        })
        .from(
          headerRef.current!.querySelector(".header__title")!,
          { y: 30, opacity: 0, duration: 0.8 },
          "-=0.45"
        )
        .from(
          headerRef.current!.querySelector(".header__desc")!,
          { y: 20, opacity: 0, duration: 0.6 },
          "-=0.5"
        )
        .from(
          headerRef.current!.querySelector(".header__rule")!,
          { scaleX: 0, opacity: 0, duration: 0.5, transformOrigin: "left" },
          "-=0.3"
        );

      // stack children
      const stackKids = stackRef.current?.children;
      if (stackKids) {
        tl.set(Array.from(stackKids), { visibility: "visible" }, "-=0.2");
        tl.from(
          Array.from(stackKids),
          {
            y: 40,
            opacity: 0,
            duration: 0.65,
            stagger: 0.12,
          },
          "-=0.25"
        );
      }

      // footer
      tl.set(footerRef.current, { visibility: "visible" }, "-=0.1")
        .from(
          footerRef.current!,
          { y: 16, opacity: 0, duration: 0.5 },
          "-=0.2"
        );
    });

    return () => ctx.revert();
  }, [wallet]); // re-run when wallet state changes

  /* ─── animate new messages in ─── */
  const animateMessages = useCallback(() => {
    if (!messagesRef.current) return;
    const items = messagesRef.current.querySelectorAll(".msg");
    gsap.from(items, {
      y: 24,
      opacity: 0,
      duration: 0.5,
      stagger: 0.07,
      ease: "power2.out",
    });
  }, []);

  /* ─── contract interactions ─── */
  const handleGetMessages = useCallback(async () => {
    try {
      setError("");
      setLoading(true);
      const client = createContractClient(wallet);

      // fetch messages and count in parallel
      const [msgTx, countTx] = await Promise.all([
        client.get_messages(),
        client.message_count(),
      ]);

      setMessages(msgTx.result ?? []);
      setMessageCount(countTx.result ?? 0);
      setTimeout(animateMessages, 50);
    } catch (err) {
      fail(err);
    } finally {
      setLoading(false);
    }
  }, [wallet, animateMessages]);

  useEffect(() => {
    if (wallet) {
      handleGetMessages();
    }
  }, [wallet, handleGetMessages]);

  async function handleAddMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    try {
      setError("");
      setSubmitting(true);
      const client = createContractClient(wallet);
      const tx = await client.add_message({
        author: String(form.get("author")),
        message: String(form.get("message")),
      });
      await tx.signAndSend();
      formEl.reset();
      await handleGetMessages();
    } catch (err) {
      fail(err);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLikeMessage(id: GuestMessage["id"]) {
    try {
      setError("");
      setLikingId(id);
      const client = createContractClient(wallet);
      const tx = await client.like_message({ id });
      await tx.signAndSend();
      await handleGetMessages();
    } catch (err) {
      fail(err);
    } finally {
      setLikingId(null);
    }
  }

  async function handleDeleteMessage(id: GuestMessage["id"]) {
    try {
      setError("");
      const client = createContractClient(wallet);
      const tx = await client.delete_message({ id });
      await tx.signAndSend();
      await handleGetMessages();
    } catch (err) {
      fail(err);
    }
  }

  /* ═══════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════ */
  return (
    <div className="app-shell">
      {/* Organic background blobs */}
      <div className="bg-shapes" aria-hidden="true">
        <div className="bg-shape bg-shape--1" />
        <div className="bg-shape bg-shape--2" />
        <div className="bg-shape bg-shape--3" />
      </div>

      <div className="app-content">
        {/* ── HEADER ── */}
        <div className="header" ref={headerRef}>
          <div className="header__brand">
            <div className="header__logo">
              <BookOpen strokeWidth={1.8} />
            </div>
            <span className="header__logotype">Soroban Guestbook</span>
          </div>

          <h1 className="header__title">
            Leave your mark
            <br />
            on the <span>blockchain</span>.
          </h1>

          <p className="header__desc">
            A decentralized guestbook living on the Stellar network — your
            message, permanently recorded and immutably yours.
          </p>

          <hr className="header__rule" />
        </div>

        {/* ── MAIN STACK ── */}
        <div className="stack" ref={stackRef}>
          {!wallet ? (
            /* ─── WELCOME CARD ─── */
            <div className="card">
              <div className="welcome">
                <div className="welcome__visual">
                  <Wallet strokeWidth={1.5} />
                </div>
                <h2 className="welcome__heading">Connect to begin</h2>
                <p className="welcome__text">
                  Link your Freighter wallet to sign the guestbook and leave a
                  message on-chain.
                </p>
                <button
                  id="connect-wallet-btn"
                  type="button"
                  className="btn btn--primary"
                  onClick={async () => {
                    try {
                      setError("");
                      setWallet(await connectFreighter());
                    } catch (err) {
                      fail(err);
                    }
                  }}
                >
                  <Wallet size={18} strokeWidth={2} />
                  Connect Freighter
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* ─── WALLET STATUS ─── */}
              <div className="wallet-status">
                <div className="wallet-status__left">
                  <div className="wallet-status__indicator" />
                  <span className="wallet-status__address" title={wallet}>
                    {truncate(wallet, 8, 6)}
                  </span>
                </div>
                <button
                  id="disconnect-wallet-btn"
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => {
                    setWallet("");
                    setMessages([]);
                    setMessageCount(null);
                  }}
                >
                  <LogOut size={14} />
                  Disconnect
                </button>
              </div>

              {/* ─── WRITE MESSAGE FORM ─── */}
              <div className="card">
                <div className="form-section__label">
                  <div className="form-section__label-icon">
                    <PenLine strokeWidth={2} />
                  </div>
                  <span className="form-section__label-text">
                    Sign the Guestbook
                  </span>
                </div>

                <form className="form" onSubmit={handleAddMessage}>
                  <input
                    id="input-author"
                    name="author"
                    className="input"
                    placeholder="Your name"
                    required
                    autoComplete="off"
                  />
                  <textarea
                    id="input-message"
                    name="message"
                    className="textarea"
                    placeholder="Write your message…"
                    rows={4}
                    required
                  />
                  <button
                    id="submit-message-btn"
                    type="submit"
                    className="btn btn--primary btn--full"
                    disabled={submitting}
                  >
                    <Send size={16} strokeWidth={2} />
                    {submitting ? "Signing transaction…" : "Post Message"}
                  </button>
                </form>
              </div>

              {/* ─── LOAD BUTTON ─── */}
              <button
                id="load-messages-btn"
                type="button"
                className="btn btn--secondary btn--full"
                onClick={handleGetMessages}
                disabled={loading}
              >
                <RefreshCw
                  size={16}
                  strokeWidth={2}
                  style={loading ? { animation: "spin 1s linear infinite" } : {}}
                />
                {loading ? "Loading…" : "Load Messages"}
              </button>

              {/* ─── MESSAGES LIST ─── */}
              {messages.length > 0 && (
                <div ref={messagesRef}>
                  <div className="messages-header">
                    <div className="messages-label">
                      <div className="messages-label__icon">
                        <MessageSquare strokeWidth={2} />
                      </div>
                      <span className="messages-label__text">Messages</span>
                    </div>
                    <span className="messages-badge">
                      {messageCount !== null ? messageCount : messages.length}{" "}
                      {(messageCount ?? messages.length) === 1
                        ? "entry"
                        : "entries"}
                    </span>
                  </div>

                  <ul className="messages-list">
                    {messages.map((msg) => (
                      <li key={String(msg.id)} className="msg">
                        <div className="msg__top">
                          <h3 className="msg__author">{msg.author}</h3>
                          <span className="msg__id">
                            <Hash size={11} />
                            {String(msg.id).slice(0, 8)}
                          </span>
                        </div>
                        <p className="msg__body">{msg.message}</p>
                        <div className="msg__foot">
                          <button
                            type="button"
                            className="btn--like"
                            onClick={() => handleLikeMessage(msg.id)}
                            disabled={likingId === msg.id}
                            title="Like this message"
                          >
                            <Heart
                              size={14}
                              strokeWidth={2}
                              className={
                                Number(msg.likes) > 0 ? "liked" : ""
                              }
                            />
                            <span>{String(msg.likes)}</span>
                          </button>
                          <button
                            type="button"
                            className="btn btn--danger-sm"
                            onClick={() => handleDeleteMessage(msg.id)}
                          >
                            <Trash2 size={13} />
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ─── EMPTY STATE ─── */}
              {messages.length === 0 && !loading && (
                <div className="empty">
                  <div className="empty__icon">
                    <Inbox strokeWidth={1.5} />
                  </div>
                  <p className="empty__title">No messages yet</p>
                  <p className="empty__desc">
                    Be the first to sign the guestbook or load existing entries.
                  </p>
                </div>
              )}

              {/* ─── LOADING ─── */}
              {loading && (
                <div className="dots" aria-label="Loading">
                  <span />
                  <span />
                  <span />
                </div>
              )}
            </>
          )}

          {/* ─── ERROR ─── */}
          {error && (
            <div className="error-bar" role="alert">
              <AlertTriangle strokeWidth={2} />
              <p className="error-bar__text">{error}</p>
            </div>
          )}
        </div>

        {/* ── FOOTER ── */}
        <footer className="footer" ref={footerRef}>
          <hr className="footer__line" />
          <p className="footer__text">
            Powered by{" "}
            <a
              href="https://soroban.stellar.org"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__link"
            >
              Soroban
            </a>{" "}
            on the Stellar Network
          </p>
        </footer>
      </div>
    </div>
  );
}
