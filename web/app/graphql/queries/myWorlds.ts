import { gql } from 'graphql-request';

export const myWorldsQuery = gql`
  query MyWorlds {
  myWorlds {
    id
    name
    description
  }
}
`;
