SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'fd7d0b31-d777-44e5-ac2c-b3aa7b1aa2cd', 'authenticated', 'authenticated', 'wlkr.smith@gmail.com', '$2a$10$igrWFufcis4z1keLotoEiep3lY9Q1XqeoNnySgDNTudGBkUfRseJS', '2026-07-29 22:02:30.744529+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-29 22:07:55.30867+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-07-29 22:02:30.704827+00', '2026-07-29 22:07:55.314659+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '4db5fd6e-45b1-4fbb-9e02-baf9f5369c12', 'authenticated', 'authenticated', 'test2@example.com', '$2a$10$M56E.JWz32fehN5XXgwVPO1wC2Y5.kO.S7fdU939an2FsSy1A6lBK', '2026-07-28 20:57:38.504543+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-28 20:58:12.936624+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-07-28 20:57:38.491395+00', '2026-07-28 20:58:12.941707+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '0b046241-592b-40c5-bd79-0b482ee04801', 'authenticated', 'authenticated', 'test@example.com', '$2a$10$GPiM9Ubst9iubU2oytFs/.XZ0sT3WhJE3IL1tk6YtPIuTIEj4ktWu', '2026-07-21 03:53:47.108209+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-28 21:06:18.531154+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "0b046241-592b-40c5-bd79-0b482ee04801", "email": "test@example.com", "email_verified": true, "phone_verified": false}', NULL, '2026-07-21 03:53:47.078236+00', '2026-07-29 22:02:50.632168+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('0b046241-592b-40c5-bd79-0b482ee04801', '0b046241-592b-40c5-bd79-0b482ee04801', '{"sub": "0b046241-592b-40c5-bd79-0b482ee04801", "email": "test@example.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-21 03:53:47.103741+00', '2026-07-21 03:53:47.103791+00', '2026-07-21 03:53:47.103791+00', 'e8eeca92-00b6-4193-b1d7-448a556ebb71'),
	('4db5fd6e-45b1-4fbb-9e02-baf9f5369c12', '4db5fd6e-45b1-4fbb-9e02-baf9f5369c12', '{"sub": "4db5fd6e-45b1-4fbb-9e02-baf9f5369c12", "email": "test2@example.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-28 20:57:38.498254+00', '2026-07-28 20:57:38.498306+00', '2026-07-28 20:57:38.498306+00', 'e076fd85-363f-4955-a552-9173fcd984a5'),
	('fd7d0b31-d777-44e5-ac2c-b3aa7b1aa2cd', 'fd7d0b31-d777-44e5-ac2c-b3aa7b1aa2cd', '{"sub": "fd7d0b31-d777-44e5-ac2c-b3aa7b1aa2cd", "email": "wlkr.smith@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-29 22:02:30.733221+00', '2026-07-29 22:02:30.733288+00', '2026-07-29 22:02:30.733288+00', '3e7cac6e-2f33-4807-a9aa-78f36a18bf36');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: expenses; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."expenses" ("id", "created_at", "amount", "description", "category", "date", "user_id") VALUES
	(10, '2026-07-28 20:54:39.896597+00', 333, 'fdafsa', 'Rent/Utilities', '2026-07-28', '0b046241-592b-40c5-bd79-0b482ee04801'),
	(11, '2026-07-28 20:54:56.191949+00', 5, 'fdafa', 'Food & Drink', '2026-07-28', '0b046241-592b-40c5-bd79-0b482ee04801'),
	(12, '2026-07-28 20:58:27.459851+00', 54321, 'test2 expesnse', 'Entertainment', '2026-07-28', '4db5fd6e-45b1-4fbb-9e02-baf9f5369c12'),
	(13, '2026-07-28 21:41:16.548382+00', 300, 'fancy dinner', 'Food & Drink', '2026-07-28', '0b046241-592b-40c5-bd79-0b482ee04801'),
	(14, '2026-07-28 21:41:30.289132+00', 250, 'six flags', 'Entertainment', '2026-07-28', '0b046241-592b-40c5-bd79-0b482ee04801');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 21, true);


--
-- Name: expenses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."expenses_id_seq"', 14, true);


--
-- PostgreSQL database dump complete
--

RESET ALL;
