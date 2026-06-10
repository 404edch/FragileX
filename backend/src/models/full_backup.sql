--
-- PostgreSQL database cluster dump
--

\restrict MCIrlMJe9HPlU1ZUFlCt4VsgDwwg8BW9d1SwMsRtvntokvsewaAPwE3h99NLQYl

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE bruno;
ALTER ROLE bruno WITH SUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:l0MZvDqToMR3Acp02oV6Jw==$AowWQBxgTUicF6/Tqlu9Jo2dYWKAdz4mr2jHV/cG0Ww=:PBVJfTHEsgrVPSBa/dIwrurDfa4gDbwAet6auIxIzQk=';
CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:vjowEtH0Rmpr4DurNg9TBA==$XEx5mzOJCJWxxM9VQs0/9bbKLEepNXNXQTyIj359s9s=:GXQtDeEtGI0xSmHW4dqkNtU7WpYTb+YWV64Tg/Zj7ZE=';

--
-- User Configurations
--








\unrestrict MCIrlMJe9HPlU1ZUFlCt4VsgDwwg8BW9d1SwMsRtvntokvsewaAPwE3h99NLQYl

--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

\restrict ncxbQKPnULppkHxy6yoGHZHzUDj3jeiZ7gA774Gxe15hagnj0egaUgPmnKAu2Pb

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

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
-- PostgreSQL database dump complete
--

\unrestrict ncxbQKPnULppkHxy6yoGHZHzUDj3jeiZ7gA774Gxe15hagnj0egaUgPmnKAu2Pb

--
-- Database "fragilex" dump
--

--
-- PostgreSQL database dump
--

\restrict vH9OwwDQ7SnRYX8gR6Shq8c59UToVVHh7vloK78LMiraNMA9T7Vt5fvXsNa0zRA

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

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
-- Name: fragilex; Type: DATABASE; Schema: -; Owner: bruno
--

CREATE DATABASE fragilex WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'pt-BR';


ALTER DATABASE fragilex OWNER TO bruno;

\unrestrict vH9OwwDQ7SnRYX8gR6Shq8c59UToVVHh7vloK78LMiraNMA9T7Vt5fvXsNa0zRA
\connect fragilex
\restrict vH9OwwDQ7SnRYX8gR6Shq8c59UToVVHh7vloK78LMiraNMA9T7Vt5fvXsNa0zRA

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: checklist_sintomas; Type: TABLE; Schema: public; Owner: bruno
--

CREATE TABLE public.checklist_sintomas (
    id_checklist integer NOT NULL,
    id_sintoma integer NOT NULL,
    possui boolean DEFAULT false
);


ALTER TABLE public.checklist_sintomas OWNER TO bruno;

--
-- Name: checklists; Type: TABLE; Schema: public; Owner: bruno
--

CREATE TABLE public.checklists (
    id integer NOT NULL,
    id_paciente integer NOT NULL,
    id_medico integer,
    preenchido_por character varying(50) NOT NULL,
    score_final numeric(4,2),
    data_preenchimento timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.checklists OWNER TO bruno;

--
-- Name: checklists_id_seq; Type: SEQUENCE; Schema: public; Owner: bruno
--

CREATE SEQUENCE public.checklists_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.checklists_id_seq OWNER TO bruno;

--
-- Name: checklists_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bruno
--

ALTER SEQUENCE public.checklists_id_seq OWNED BY public.checklists.id;


--
-- Name: exame; Type: TABLE; Schema: public; Owner: bruno
--

CREATE TABLE public.exame (
    id_documento integer NOT NULL,
    id_paciente integer NOT NULL,
    id_medico integer NOT NULL,
    tipo_exame character varying(100),
    caminho_arquivo character varying(255) NOT NULL,
    data_upload date DEFAULT CURRENT_DATE
);


ALTER TABLE public.exame OWNER TO bruno;

--
-- Name: exame_id_documento_seq; Type: SEQUENCE; Schema: public; Owner: bruno
--

CREATE SEQUENCE public.exame_id_documento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.exame_id_documento_seq OWNER TO bruno;

--
-- Name: exame_id_documento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bruno
--

ALTER SEQUENCE public.exame_id_documento_seq OWNED BY public.exame.id_documento;


--
-- Name: funcionarios_ibk; Type: TABLE; Schema: public; Owner: bruno
--

CREATE TABLE public.funcionarios_ibk (
    id_usuario integer NOT NULL
);


ALTER TABLE public.funcionarios_ibk OWNER TO bruno;

--
-- Name: historico_medico; Type: TABLE; Schema: public; Owner: bruno
--

CREATE TABLE public.historico_medico (
    id integer NOT NULL,
    id_paciente integer NOT NULL,
    ja_fez_pcr boolean DEFAULT false,
    tipo_mutacao character varying(50),
    tem_autismo boolean DEFAULT false,
    hist_deficiencia_intelectual boolean DEFAULT false,
    hist_menopausa_precoce boolean DEFAULT false,
    hist_ataxia boolean DEFAULT false,
    interesse_exame boolean DEFAULT false
);


ALTER TABLE public.historico_medico OWNER TO bruno;

--
-- Name: historico_medico_id_seq; Type: SEQUENCE; Schema: public; Owner: bruno
--

CREATE SEQUENCE public.historico_medico_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historico_medico_id_seq OWNER TO bruno;

--
-- Name: historico_medico_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bruno
--

ALTER SEQUENCE public.historico_medico_id_seq OWNED BY public.historico_medico.id;


--
-- Name: medicos; Type: TABLE; Schema: public; Owner: bruno
--

CREATE TABLE public.medicos (
    id_usuario integer NOT NULL,
    crm character varying(20) NOT NULL,
    especialidade character varying(50)
);


ALTER TABLE public.medicos OWNER TO bruno;

--
-- Name: pacientes; Type: TABLE; Schema: public; Owner: bruno
--

CREATE TABLE public.pacientes (
    id_usuario integer NOT NULL,
    data_nascimento date NOT NULL,
    sexo_biologico character(1) NOT NULL,
    genero character(15) NOT NULL,
    sindrome character varying(20) NOT NULL,
    CONSTRAINT pacientes_genero_check CHECK ((genero = ANY (ARRAY['Feminino'::bpchar, 'Masculino'::bpchar]))),
    CONSTRAINT pacientes_sexo_biologico_check CHECK ((sexo_biologico = ANY (ARRAY['M'::bpchar, 'F'::bpchar]))),
    CONSTRAINT pacientes_sindrome_check CHECK (((sindrome)::text = ANY ((ARRAY['normal'::character varying, 'mutacao'::character varying, 'pre_mutacao'::character varying])::text[])))
);


ALTER TABLE public.pacientes OWNER TO bruno;

--
-- Name: sintomas; Type: TABLE; Schema: public; Owner: bruno
--

CREATE TABLE public.sintomas (
    id integer NOT NULL,
    sintoma character varying(150) NOT NULL,
    score_f numeric(4,2) NOT NULL,
    score_m numeric(4,2) NOT NULL
);


ALTER TABLE public.sintomas OWNER TO bruno;

--
-- Name: sintomas_id_seq; Type: SEQUENCE; Schema: public; Owner: bruno
--

CREATE SEQUENCE public.sintomas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sintomas_id_seq OWNER TO bruno;

--
-- Name: sintomas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bruno
--

ALTER SEQUENCE public.sintomas_id_seq OWNED BY public.sintomas.id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: bruno
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nome character varying(100) NOT NULL,
    cpf character varying(14),
    email character varying(100) NOT NULL,
    telefone character varying(20),
    senha_hash character varying(255) NOT NULL,
    data_criacao timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.usuarios OWNER TO bruno;

--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: bruno
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO bruno;

--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bruno
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: checklists id; Type: DEFAULT; Schema: public; Owner: bruno
--

ALTER TABLE ONLY public.checklists ALTER COLUMN id SET DEFAULT nextval('public.checklists_id_seq'::regclass);


--
-- Name: exame id_documento; Type: DEFAULT; Schema: public; Owner: bruno
--

ALTER TABLE ONLY public.exame ALTER COLUMN id_documento SET DEFAULT nextval('public.exame_id_documento_seq'::regclass);


--
-- Name: historico_medico id; Type: DEFAULT; Schema: public; Owner: bruno
--

ALTER TABLE ONLY public.historico_medico ALTER COLUMN id SET DEFAULT nextval('public.historico_medico_id_seq'::regclass);


--
-- Name: sintomas id; Type: DEFAULT; Schema: public; Owner: bruno
--

ALTER TABLE ONLY public.sintomas ALTER COLUMN id SET DEFAULT nextval('public.sintomas_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: bruno
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Data for Name: checklist_sintomas; Type: TABLE DATA; Schema: public; Owner: bruno
--

COPY public.checklist_sintomas (id_checklist, id_sintoma, possui) FROM stdin;
\.


--
-- Data for Name: checklists; Type: TABLE DATA; Schema: public; Owner: bruno
--

COPY public.checklists (id, id_paciente, id_medico, preenchido_por, score_final, data_preenchimento) FROM stdin;
\.


--
-- Data for Name: exame; Type: TABLE DATA; Schema: public; Owner: bruno
--

COPY public.exame (id_documento, id_paciente, id_medico, tipo_exame, caminho_arquivo, data_upload) FROM stdin;
\.


--
-- Data for Name: funcionarios_ibk; Type: TABLE DATA; Schema: public; Owner: bruno
--

COPY public.funcionarios_ibk (id_usuario) FROM stdin;
\.


--
-- Data for Name: historico_medico; Type: TABLE DATA; Schema: public; Owner: bruno
--

COPY public.historico_medico (id, id_paciente, ja_fez_pcr, tipo_mutacao, tem_autismo, hist_deficiencia_intelectual, hist_menopausa_precoce, hist_ataxia, interesse_exame) FROM stdin;
\.


--
-- Data for Name: medicos; Type: TABLE DATA; Schema: public; Owner: bruno
--

COPY public.medicos (id_usuario, crm, especialidade) FROM stdin;
\.


--
-- Data for Name: pacientes; Type: TABLE DATA; Schema: public; Owner: bruno
--

COPY public.pacientes (id_usuario, data_nascimento, sexo_biologico, genero, sindrome) FROM stdin;
\.


--
-- Data for Name: sintomas; Type: TABLE DATA; Schema: public; Owner: bruno
--

COPY public.sintomas (id, sintoma, score_f, score_m) FROM stdin;
1	Atraso na fala	0.01	0.14
2	Dificuldades de aprendizado	0.28	0.18
3	Déficit de atenção	0.12	0.17
4	Deficiência intelectual (ID)	0.20	0.32
5	Hiperatividade	0.04	0.12
6	Agressividade	0.02	0.01
7	Evita contato visual	0.08	0.06
8	Evita contato físico	0.07	0.04
9	Movimentos intencionais, repetitivos e rítmicos	0.05	0.17
10	Hiperflexibilidade articular (hipermobilidade)	0.04	0.19
11	Macroorquidia	0.00	0.26
12	Face alongada, mandíbula proeminente e/ou orelhas de abano	0.09	0.29
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: bruno
--

COPY public.usuarios (id, nome, cpf, email, telefone, senha_hash, data_criacao) FROM stdin;
\.


--
-- Name: checklists_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bruno
--

SELECT pg_catalog.setval('public.checklists_id_seq', 1, false);


--
-- Name: exame_id_documento_seq; Type: SEQUENCE SET; Schema: public; Owner: bruno
--

SELECT pg_catalog.setval('public.exame_id_documento_seq', 1, false);


--
-- Name: historico_medico_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bruno
--

SELECT pg_catalog.setval('public.historico_medico_id_seq', 1, false);


--
-- Name: sintomas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bruno
--

SELECT pg_catalog.setval('public.sintomas_id_seq', 12, true);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bruno
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 1, false);


--
-- Name: checklist_sintomas checklist_sintomas_pkey; Type: CONSTRAINT; Schema: public; Owner: bruno
--

ALTER TABLE ONLY public.checklist_sintomas
    ADD CONSTRAINT checklist_sintomas_pkey PRIMARY KEY (id_checklist, id_sintoma);


--
-- Name: checklists checklists_pkey; Type: CONSTRAINT; Schema: public; Owner: bruno
--

ALTER TABLE ONLY public.checklists
    ADD CONSTRAINT checklists_pkey PRIMARY KEY (id);


--
-- Name: exame exame_pkey; Type: CONSTRAINT; Schema: public; Owner: bruno
--

ALTER TABLE ONLY public.exame
    ADD CONSTRAINT exame_pkey PRIMARY KEY (id_documento);


--
-- Name: funcionarios_ibk funcionarios_ibk_pkey; Type: CONSTRAINT; Schema: public; Owner: bruno
--

ALTER TABLE ONLY public.funcionarios_ibk
    ADD CONSTRAINT funcionarios_ibk_pkey PRIMARY KEY (id_usuario);


--
-- Name: historico_medico historico_medico_pkey; Type: CONSTRAINT; Schema: public; Owner: bruno
--

ALTER TABLE ONLY public.historico_medico
    ADD CONSTRAINT historico_medico_pkey PRIMARY KEY (id);


--
-- Name: medicos medicos_crm_key; Type: CONSTRAINT; Schema: public; Owner: bruno
--

ALTER TABLE ONLY public.medicos
    ADD CONSTRAINT medicos_crm_key UNIQUE (crm);


--
-- Name: medicos medicos_pkey; Type: CONSTRAINT; Schema: public; Owner: bruno
--

ALTER TABLE ONLY public.medicos
    ADD CONSTRAINT medicos_pkey PRIMARY KEY (id_usuario);


--
-- Name: pacientes pacientes_pkey; Type: CONSTRAINT; Schema: public; Owner: bruno
--

ALTER TABLE ONLY public.pacientes
    ADD CONSTRAINT pacientes_pkey PRIMARY KEY (id_usuario);


--
-- Name: sintomas sintomas_pkey; Type: CONSTRAINT; Schema: public; Owner: bruno
--

ALTER TABLE ONLY public.sintomas
    ADD CONSTRAINT sintomas_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_cpf_key; Type: CONSTRAINT; Schema: public; Owner: bruno
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_cpf_key UNIQUE (cpf);


--
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: bruno
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: bruno
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: checklist_sintomas fk_checklist; Type: FK CONSTRAINT; Schema: public; Owner: bruno
--

ALTER TABLE ONLY public.checklist_sintomas
    ADD CONSTRAINT fk_checklist FOREIGN KEY (id_checklist) REFERENCES public.checklists(id) ON DELETE CASCADE;


--
-- Name: funcionarios_ibk fk_funcionario_usuario; Type: FK CONSTRAINT; Schema: public; Owner: bruno
--

ALTER TABLE ONLY public.funcionarios_ibk
    ADD CONSTRAINT fk_funcionario_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: historico_medico fk_historico_paciente; Type: FK CONSTRAINT; Schema: public; Owner: bruno
--

ALTER TABLE ONLY public.historico_medico
    ADD CONSTRAINT fk_historico_paciente FOREIGN KEY (id_paciente) REFERENCES public.pacientes(id_usuario) ON DELETE CASCADE;


--
-- Name: checklists fk_medico; Type: FK CONSTRAINT; Schema: public; Owner: bruno
--

ALTER TABLE ONLY public.checklists
    ADD CONSTRAINT fk_medico FOREIGN KEY (id_medico) REFERENCES public.medicos(id_usuario) ON DELETE SET NULL;


--
-- Name: exame fk_medico; Type: FK CONSTRAINT; Schema: public; Owner: bruno
--

ALTER TABLE ONLY public.exame
    ADD CONSTRAINT fk_medico FOREIGN KEY (id_medico) REFERENCES public.medicos(id_usuario) ON DELETE CASCADE;


--
-- Name: medicos fk_medico_usuario; Type: FK CONSTRAINT; Schema: public; Owner: bruno
--

ALTER TABLE ONLY public.medicos
    ADD CONSTRAINT fk_medico_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: checklists fk_paciente; Type: FK CONSTRAINT; Schema: public; Owner: bruno
--

ALTER TABLE ONLY public.checklists
    ADD CONSTRAINT fk_paciente FOREIGN KEY (id_paciente) REFERENCES public.pacientes(id_usuario) ON DELETE CASCADE;


--
-- Name: exame fk_paciente; Type: FK CONSTRAINT; Schema: public; Owner: bruno
--

ALTER TABLE ONLY public.exame
    ADD CONSTRAINT fk_paciente FOREIGN KEY (id_paciente) REFERENCES public.pacientes(id_usuario) ON DELETE CASCADE;


--
-- Name: pacientes fk_paciente_usuario; Type: FK CONSTRAINT; Schema: public; Owner: bruno
--

ALTER TABLE ONLY public.pacientes
    ADD CONSTRAINT fk_paciente_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: checklist_sintomas fk_sintoma; Type: FK CONSTRAINT; Schema: public; Owner: bruno
--

ALTER TABLE ONLY public.checklist_sintomas
    ADD CONSTRAINT fk_sintoma FOREIGN KEY (id_sintoma) REFERENCES public.sintomas(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict vH9OwwDQ7SnRYX8gR6Shq8c59UToVVHh7vloK78LMiraNMA9T7Vt5fvXsNa0zRA

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

\restrict ZAcQwtq0k1KzdCoZYhkFOShYVqLS9YwbLxprvtpEaXi8Jg6vZINHH9AyEEEWPp3

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

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
-- PostgreSQL database dump complete
--

\unrestrict ZAcQwtq0k1KzdCoZYhkFOShYVqLS9YwbLxprvtpEaXi8Jg6vZINHH9AyEEEWPp3

--
-- PostgreSQL database cluster dump complete
--

