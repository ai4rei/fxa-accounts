SET NAMES utf8mb4 COLLATE utf8mb4_bin;

CALL assertPatchLevel('128');

SET NAMES utf8mb4 COLLATE utf8mb4_bin;

CREATE PROCEDURE `consumeUnblockCode_4`(
    inUid BINARY(16),
    inCodeHash BINARY(32)
)
BEGIN
	DECLARE timestamp BIGINT;

    SELECT createdAt into @timestamp FROM unblockCodes
	WHERE
		uid = inUid
	AND
		unblockCodeHash = inCodeHash;

    IF @timestamp > 0 THEN
        DELETE FROM unblockCodes
        WHERE
            uid = inUid;
    END IF;

    SELECT @timestamp AS createdAt;


END


UPDATE dbMetadata SET value = '129' WHERE name = 'schema-patch-level';
