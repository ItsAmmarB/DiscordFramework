const GetPlayerIdentifiers = PlayerId => {
    const Identifiers = [];
    for (let i = 0; i < GetNumPlayerIdentifiers(PlayerId); i++) {
        const Identifier = GetPlayerIdentifier(PlayerId, i);
        Identifiers.push(Identifier);
    }

    return Identifiers;
};