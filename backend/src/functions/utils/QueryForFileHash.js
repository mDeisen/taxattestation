const { GraphQLClient, gql } = require('graphql-request');

async function verifyHashExists(graphqlEndpoint, attester, schemaId, revoked, dataHash) {
  const query = gql`
    query verifyHash($attester: String!, $schemaId: String!, $revoked: Boolean!, $dataHash: String!) {
      attestations(where: { 
        AND: [
          { attester: { equals: $attester } },
          { schema: { is: { id: { equals: $schemaId } } } },
          { revoked: { equals: $revoked } },
          { data: { equals: $dataHash }}
        ] 
      }) {
        id
      }
    }
  `;

  const client = new GraphQLClient(graphqlEndpoint);
  try {
    const response = await client.request(query, { attester, schemaId, revoked, dataHash });
    return response.attestations.length > 0;
  } catch (error) {
    console.error("Error in GraphQL query:", error);
    return false;
  }
}

module.exports = verifyHashExists;


