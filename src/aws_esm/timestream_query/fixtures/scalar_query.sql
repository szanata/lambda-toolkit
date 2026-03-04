SELECT
  true as boolean,
  cast(23.33333 as DOUBLE) as double,
  from_iso8601_timestamp( '2025-01-01T10:12:30.333Z' ) as timestamp,
  cast(42 as INTEGER) as integer,
  cast('foo' as VARCHAR) as varchar,
  cast(9223372036854775807 as BIGINT) as bigint,
  cast('2025-01-01' as DATE) as date,
  cast('10:33:22' as TIME) as time,
  cast(23s as INTERVAL DAY TO SECOND) as interval_day_to_second,
  cast(23month as INTERVAL YEAR TO MONTH) as interval_year_to_month,
  null as nil;
