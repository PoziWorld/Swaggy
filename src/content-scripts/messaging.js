import logger from 'Shared/logger';
import { handleVoiceControlToggle } from 'ContentScripts/request-listener';

/**
 * On browser action click, switch the voice control listener ON or OFF depending on the current status.
 *
 * @return {Promise<void>}
 */

export async function switchVoiceControlListener() {
  try {
    await handleVoiceControlToggle();

    logger.verbose( `switchVoiceControlListener` );
  }
  catch ( e ) {
    /**
     * @todo
     */
  }
}
