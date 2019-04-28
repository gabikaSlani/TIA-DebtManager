CREATE TABLE images
(
    id bigint NOT NULL DEFAULT nextval('images_id_seq'::regclass),
    name character varying NOT NULL,
    CONSTRAINT images_pkey PRIMARY KEY (id)
)

CREATE TABLE users
(
    id bigint NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    login character varying(20) NOT NULL,
    password character varying(100) NOT NULL,
    image_id integer,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT unique_login UNIQUE (login),
    CONSTRAINT user_image FOREIGN KEY (image_id)
        REFERENCES images (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE categories
(
    id integer NOT NULL DEFAULT nextval('categories_id_seq'::regclass),
    name character varying NOT NULL,
    CONSTRAINT categories_pkey PRIMARY KEY (id)
)

CREATE TABLE states
(
    id integer NOT NULL DEFAULT nextval('states_id_seq'::regclass),
    name character varying NOT NULL,
    CONSTRAINT states_pkey PRIMARY KEY (id)
)

CREATE TABLE types
(
    id integer NOT NULL DEFAULT nextval('types_id_seq'::regclass),
    name character varying NOT NULL,
    CONSTRAINT types_pkey PRIMARY KEY (id)
)

CREATE TABLE items
(
    id bigint NOT NULL DEFAULT nextval('items_id_seq'::regclass),
    name character varying NOT NULL,
    amount numeric NOT NULL,
    date timestamp without time zone NOT NULL,
    creator_id integer NOT NULL,
    photo_id integer,
    group_id integer,
    category_id integer,
    CONSTRAINT items_pkey PRIMARY KEY (id),
    CONSTRAINT cateories_items_fk FOREIGN KEY (category_id)
        REFERENCES categories (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT groups_items_fk FOREIGN KEY (group_id)
        REFERENCES groups (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT images_items_fk FOREIGN KEY (photo_id)
        REFERENCES images (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT users_items_fk FOREIGN KEY (creator_id)
        REFERENCES users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE chip_in_item
(
    item_id integer NOT NULL,
    user_id integer NOT NULL,
    CONSTRAINT chip_in_item_pk PRIMARY KEY (item_id, user_id)
)

CREATE TABLE debts
(
    id bigint NOT NULL DEFAULT nextval('debts_id_seq'::regclass),
    amount numeric NOT NULL,
    settled boolean NOT NULL DEFAULT false,
    receiver_id integer NOT NULL,
    payer_id integer NOT NULL,
    item_id integer NOT NULL,
    CONSTRAINT debts_pkey PRIMARY KEY (id),
    CONSTRAINT items_debts_fk FOREIGN KEY (item_id)
        REFERENCES items (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT users_debts_payer_fk FOREIGN KEY (payer_id)
        REFERENCES users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT users_debts_receiver_fk FOREIGN KEY (receiver_id)
        REFERENCES users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE groups
(
    id bigint NOT NULL DEFAULT nextval('groups_id_seq'::regclass),
    name character varying NOT NULL,
    date timestamp without time zone NOT NULL,
    creator_id integer NOT NULL,
    image_d integer,
    CONSTRAINT groups_pkey PRIMARY KEY (id),
    CONSTRAINT images_groups_fk FOREIGN KEY (image_d)
        REFERENCES images (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT users_groups_fk FOREIGN KEY (creator_id)
        REFERENCES users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE requests
(
    id bigint NOT NULL DEFAULT nextval('requests_id_seq'::regclass),
    creation_date timestamp without time zone NOT NULL,
    answer_date timestamp without time zone,
    responder_id integer,
    requester_id integer,
    state_id integer,
    type_id integer,
    CONSTRAINT requests_pkey PRIMARY KEY (id),
    CONSTRAINT states_requests_fk FOREIGN KEY (state_id)
        REFERENCES states (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT types_requests_fk FOREIGN KEY (type_id)
        REFERENCES types (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT users_requests_requester_fk FOREIGN KEY (requester_id)
        REFERENCES users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT users_requests_responder_fk FOREIGN KEY (responder_id)
        REFERENCES users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE notifications
(
    id bigint NOT NULL DEFAULT nextval('notifications_id_seq'::regclass),
    message character varying NOT NULL,
    seen boolean NOT NULL DEFAULT false,
    receiver_id integer NOT NULL,
    type_id integer NOT NULL,
    request_id integer,
    CONSTRAINT notifications_pkey PRIMARY KEY (id),
    CONSTRAINT requests_notifications_fk FOREIGN KEY (request_id)
        REFERENCES requests (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT types_notifications_fk FOREIGN KEY (type_id)
        REFERENCES types (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT users_notifications_fk FOREIGN KEY (receiver_id)
        REFERENCES users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE user_in_group
(
    user_id integer NOT NULL,
    group_is integer NOT NULL,
    CONSTRAINT users_in_group_pk PRIMARY KEY (user_id, group_is)
)


CREATE TABLE friends
(
    user1_id integer NOT NULL,
    user2_id integer NOT NULL,
    CONSTRAINT friends_pk PRIMARY KEY (user1_id, user2_id),
    CONSTRAINT users_friends1_fk FOREIGN KEY (user1_id)
        REFERENCES users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT users_friends2_fk FOREIGN KEY (user2_id)
        REFERENCES users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
