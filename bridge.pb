
?
assembly/proto/bridge.protobridgekoinos/options.proto"K
initialize_arguments3
initial_validators (B??RinitialValidators"
initialize_result"j
get_validators_arguments
start (B??Rstart
limit (Rlimit
	direction (R	direction"p
get_supported_tokens_arguments
start (B??Rstart
limit (Rlimit
	direction (R	direction"x
&get_supported_wrapped_tokens_arguments
start (B??Rstart
limit (Rlimit
	direction (R	direction"8
repeated_addresses"
	addresses (B??R	addresses"
get_metadata_arguments"K
set_pause_arguments

signatures (R
signatures
pause (Rpause"
set_pause_result"?
transfer_tokens_arguments
from (B??Rfrom
token (B??Rtoken
amount (Ramount
	recipient (	R	recipient"
transfer_tokens_result"?
complete_transfer_arguments+
transaction_id (B??RtransactionId
token (B??Rtoken
	recipient (R	recipient
value (Rvalue

signatures (R
signatures"
complete_transfer_result"]
add_validator_arguments

signatures (R
signatures"
	validator (B??R	validator"
add_validator_result"`
remove_validator_arguments

signatures (R
signatures"
	validator (B??R	validator"
remove_validator_result"[
add_supported_token_arguments

signatures (R
signatures
token (B??Rtoken"
add_supported_token_result"^
 remove_supported_token_arguments

signatures (R
signatures
token (B??Rtoken"
remove_supported_token_result"c
%add_supported_wrapped_token_arguments

signatures (R
signatures
token (B??Rtoken"$
"add_supported_wrapped_token_result"f
(remove_supported_wrapped_token_arguments

signatures (R
signatures
token (B??Rtoken"'
%remove_supported_wrapped_token_result"?
transfer_tokens_event
from (B??Rfrom
token (B??Rtoken
amount (Ramount
	recipient (	R	recipient"?
add_remove_action_hash)
action (2.bridge.action_idRaction
address (Raddress
nonce (Rnonce
contract_id (R
contractId"?
set_pause_action_hash)
action (2.bridge.action_idRaction
pause (Rpause
nonce (Rnonce
contract_id (R
contractId"?
complete_transfer_hash)
action (2.bridge.action_idRaction%
transaction_id (RtransactionId
token (Rtoken
	recipient (R	recipient
amount (Ramount
contract_id (R
contractId"n
metadata_object 
initialized (Rinitialized
nonce (Rnonce#
nb_validators (RnbValidators"
validator_object"
wrapped_token_object"
token_object*?
	action_id
reserved_action 
add_validator
remove_validator
add_supported_token
remove_supported_token
add_supported_wrapped_token"
remove_supported_wrapped_token
	set_pause
complete_transferbproto3