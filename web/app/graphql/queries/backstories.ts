import { gql } from 'graphql-request';

export const backstoriesQuery = gql`
  query Backstories($worldId: ID!) {
  backstories(worldId: $worldId) {
    id
    title
    characterName
    content
    world {
      id
      name
      description
    }
  }
}
`;
