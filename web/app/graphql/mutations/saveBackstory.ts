import { gql } from 'graphql-request';

export const saveBackstoryMutation = gql`
  mutation SaveBackstory($title: String!, $content: String!, $worldId: ID!, $characterName: String!) {
  saveBackstory(title: $title, content: $content, worldId: $worldId, characterName: $characterName) {
    id
    title
    characterName
    content
    world {
      id
      name
    }
  }
}
`;
