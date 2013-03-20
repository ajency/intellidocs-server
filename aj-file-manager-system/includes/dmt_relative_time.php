<?php

function wp_core_time_since( $older_date, $newer_date = false ) {

	// Setup the strings
	$unknown_text   = apply_filters( 'bp_core_time_since_unknown_text',   __( 'sometime',  'buddypress' ) );
	$right_now_text = apply_filters( 'bp_core_time_since_right_now_text', __( 'right now', 'buddypress' ) );
	$ago_text       = apply_filters( 'bp_core_time_since_ago_text',       __( '%s ago',    'buddypress' ) );

	// array of time period chunks
	$chunks = array(
		array( 60 * 60 * 24 * 365 , __( 'year',   'buddypress' ), __( 'years',   'buddypress' ) ),
		array( 60 * 60 * 24 * 30 ,  __( 'month',  'buddypress' ), __( 'months',  'buddypress' ) ),
		array( 60 * 60 * 24 * 7,    __( 'week',   'buddypress' ), __( 'weeks',   'buddypress' ) ),
		array( 60 * 60 * 24 ,       __( 'day',    'buddypress' ), __( 'days',    'buddypress' ) ),
		array( 60 * 60 ,            __( 'hour',   'buddypress' ), __( 'hours',   'buddypress' ) ),
		array( 60 ,                 __( 'minute', 'buddypress' ), __( 'minutes', 'buddypress' ) ),
		array( 1,                   __( 'second', 'buddypress' ), __( 'seconds', 'buddypress' ) )
	);

	if ( !empty( $older_date ) && !is_numeric( $older_date ) ) {
		$time_chunks = explode( ':', str_replace( ' ', ':', $older_date ) );
		$date_chunks = explode( '-', str_replace( ' ', '-', $older_date ) );
		$older_date  = gmmktime( (int) $time_chunks[1], (int) $time_chunks[2], (int) $time_chunks[3], (int) $date_chunks[1], (int) $date_chunks[2], (int) $date_chunks[0] );
	}

	/**
	 * $newer_date will equal false if we want to know the time elapsed between
	 * a date and the current time. $newer_date will have a value if we want to
	 * work out time elapsed between two known dates.
	 */
	$newer_date = ( !$newer_date ) ? strtotime( wp_core_current_time() ) : $newer_date;

	// Difference in seconds
	$since = $newer_date - $older_date;

	// Something went wrong with date calculation and we ended up with a negative date.
	if ( 0 > $since ) {
		$output = $unknown_text;

	/**
	 * We only want to output two chunks of time here, eg:
	 * x years, xx months
	 * x days, xx hours
	 * so there's only two bits of calculation below:
	 */
	} else {

		// Step one: the first chunk
		for ( $i = 0, $j = count( $chunks ); $i < $j; ++$i ) {
			$seconds = $chunks[$i][0];

			// Finding the biggest chunk (if the chunk fits, break)
			$count = floor( $since / $seconds );
			if ( 0 != $count ) {
				break;
			}
		}

		// If $i iterates all the way to $j, then the event happened 0 seconds ago
		if ( !isset( $chunks[$i] ) ) {
			$output = $right_now_text;

		} else {

			// Set output var
			$output = ( 1 == $count ) ? '1 '. $chunks[$i][1] : $count . ' ' . $chunks[$i][2];

			// Step two: the second chunk
			if ( $i + 2 < $j ) {
				$seconds2 = $chunks[$i + 1][0];
				$name2    = $chunks[$i + 1][1];
				$count2   = floor( ( $since - ( $seconds * $count ) ) / $seconds2 );

				// Add to output var
				if ( 0 != $count2 ) {
					$output .= ( 1 == $count2 ) ? _x( ',', 'Separator in time since', 'buddypress' ) . ' 1 '. $name2 : _x( ',', 'Separator in time since', 'buddypress' ) . ' ' . $count2 . ' ' . $chunks[$i + 1][2];
				}
			}

			// No output, so happened right now
			if ( ! (int) trim( $output ) ) {
				$output = $right_now_text;
			}
		}
	}

	// Append 'ago' to the end of time-since if not 'right now'
	if ( $output != $right_now_text ) {
		$output = sprintf( $ago_text, $output );
	}

	return $output;
}

function wp_core_current_time( $gmt = true ) {
	// Get current time in MYSQL format
	$current_time = current_time( 'mysql', $gmt );

	return  $current_time ;
}
?>