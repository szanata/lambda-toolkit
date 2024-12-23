module.exports = input =>
  // Break the string into sequences to rebuild later
  !input ? input : input.split( /\s/ )
    // ALL_CAPS terms are ignored
    .map( term => [ term, term.charAt( 0 ).toUpperCase() + term.slice( 1 ).toLowerCase() ] )
    // Rebuild the string replacing the converter terms keeping the original delimiters
    .reduce( ( result, [ term, repl ] ) => result.replace( term, repl ), input );
