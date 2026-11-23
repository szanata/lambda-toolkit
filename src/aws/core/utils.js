
const isObjectWithKeys = v => typeof v === 'object' && v !== null && Object.keys( v ).length > 0;

const isUsingOldSyntax = v => Array.isArray( v ) && v.length === 1 && Array.isArray( v[0] ) && isObjectWithKeys( v[0] );

/* @TEMP: Keep accepting old args as array syntax to not break contracts, this will be removed down the road. */
export const unwrapOldNativeArgsSyntax = ( args, factoryName ) => {
  const oldSyntax = isUsingOldSyntax( args );
  if ( oldSyntax ) {
    console.warn( `[DEPRECATED] Factory ${factoryName} called using array of arguments. Pass arguments directly.` );
    return args[0];
  }

  return args;
};
