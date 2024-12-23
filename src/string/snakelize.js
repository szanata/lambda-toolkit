// convert a string to snake_case
module.exports = input =>
  // Break the string into sequences to rebuild later
  !input ? input : input.split( /\s/ )
    // ALL_CAPS terms are ignored
    .map( term => [ term, /^[A-Z_]+$/g.test( term ) ? term : term
      .replace( /-/g, '_' ) // replaces hyphen
      .replace( /([a-z\d])([A-Z])/g, '$1_$2' ) // add _ between lower and upper case letters
      .replace( /([A-Z])([A-Z])(?=[a-z\d])/g, '$1_$2' ).toLowerCase() // add _ between uppercase char and next uppercase char follow by lowercase
    ] )
    // Rebuild the string replacing the converter terms keeping the original delimiters
    .reduce( ( result, [ term, repl ] ) => result.replace( term, repl ), input );
