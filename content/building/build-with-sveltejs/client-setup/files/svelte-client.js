export default createClient({
  
  /**
    Uncomment the appropriate line according to the
    region group where you created your database.
  **/

	//url: https://graphql.eu.fauna.com/graphql
  //url: https://graphql.us.fauna.com/graphql

  url: `https://graphql.fauna.com/graphql`,

  fetchOptions: () => {
    const token = import.meta.env.VITE_PUBLIC_FAUNA_KEY;
    return {
      headers: { authorization: token ? `Bearer ${token}` : '' },
    };
  },
}); 
