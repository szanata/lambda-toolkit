// Convert a string to camelCase
module.exports = input =>
  // Break the string into sequences to rebuild later
  !input ? input : input.split( /\s/ )
    // ALL_CAPS terms are ignored
    .map( term => [ term, /^[A-Z_]+$/g.test( term ) ? term : term
      // Matches the penultimate letter in a sequence of upper case followed by lower case and convert it to lower case
      // Effectively creating a word break eg: BDay => bDay
      .replace( /[A-Z](?=[A-Z][a-z])/g, c => `${c[0].toLowerCase()}` )
      .replace( /([A-Z])([A-Z]+)/g, c => `${c[0]}${c.slice( 1 ).toLowerCase()}` ) // Sequences of upper case
      .replace( /([-_]\w)/g, c => c[1].toUpperCase() ) // first letter after hyphen and underline
      .replace( /^([A-Z])/g, c => c[0].toLowerCase() ) // first letter
    ] )
    // Rebuild the string replacing the converter terms keeping the original delimiters
    .reduce( ( result, [ term, repl ] ) => result.replace( term, repl ), input );
