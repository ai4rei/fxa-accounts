SET NAMES utf8mb4 COLLATE utf8mb4_bin;

CALL assertPatchLevel('128');

INSERT INTO securityEventNames(name) VALUES ('account.enable'), ('account.disable');

UPDATE dbMetadata SET value = '129' WHERE name = 'schema-patch-level';
