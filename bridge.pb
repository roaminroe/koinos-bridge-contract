
í
assembly/proto/bridge.protobridgekoinos/options.proto"K
initialize_arguments3
initial_validators (B€µRinitialValidators"
initialize_result"j
get_validators_arguments
start (B€µRstart
limit (Rlimit
	direction (R	direction"p
get_supported_tokens_arguments
start (B€µRstart
limit (Rlimit
	direction (R	direction"x
&get_supported_wrapped_tokens_arguments
start (B€µRstart
limit (Rlimit
	direction (R	direction"8
repeated_addresses"
	addresses (B€µR	addresses"
get_metadata_arguments"K
set_pause_arguments

signatures (R
signatures
pause (Rpause"
set_pause_result"‡
transfer_tokens_arguments
from (B€µRfrom
token (B€µRtoken
amount (Ramount
	recipient (	R	recipient"
transfer_tokens_result"º
complete_transfer_arguments+
transaction_id (B€µRtransactionId
token (B€µRtoken
	recipient (R	recipient
value (Rvalue

signatures (R
signatures"
complete_transfer_result"]
add_validator_arguments

signatures (R
signatures"
	validator (B€µR	validator"
add_validator_result"`
remove_validator_arguments

signatures (R
signatures"
	validator (B€µR	validator"
remove_validator_result"[
add_supported_token_arguments

signatures (R
signatures
token (B€µRtoken"
add_supported_token_result"^
 remove_supported_token_arguments

signatures (R
signatures
token (B€µRtoken"
remove_supported_token_result"c
%add_supported_wrapped_token_arguments

signatures (R
signatures
token (B€µRtoken"$
"add_supported_wrapped_token_result"f
(remove_supported_wrapped_token_arguments

signatures (R
signatures
token (B€µRtoken"'
%remove_supported_wrapped_token_result"ƒ
transfer_tokens_event
from (B€µRfrom
token (B€µRtoken
amount (Ramount
	recipient (	R	recipient"i
add_remove_action_hash
address (Raddress
nonce (Rnonce
contract_id (R
contractId"d
set_pause_action_hash
pause (Rpause
nonce (Rnonce
contract_id (R
contractId"¬
complete_transfer_hash%
transaction_id (RtransactionId
token (Rtoken
	recipient (R	recipient
amount (Ramount
contract_id (R
contractId"n
metadata_object 
initialized (Rinitialized
nonce (Rnonce#
nb_validators (RnbValidators"
validator_object"
wrapped_token_object"
token_objectbproto3