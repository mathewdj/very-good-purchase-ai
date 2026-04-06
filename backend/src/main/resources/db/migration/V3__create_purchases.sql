CREATE TABLE purchases (
    id BIGSERIAL PRIMARY KEY,
    date DATE NOT NULL,
    description VARCHAR(500) NOT NULL,
    amount NUMERIC(19, 2) NOT NULL,
    purchase_type_id BIGINT NOT NULL REFERENCES purchase_types(id)
);
