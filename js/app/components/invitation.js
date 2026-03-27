
import { util } from '../../common/util.js';
import { lang } from '../../common/language.js';
import { auth } from '../admin/auth.js';
import { HTTP_POST, request } from '../../connection/request.js';
import { session } from '../../common/session.js';
import { dto } from '../../connection/dto.js';

export const invitation = (() => {

       /**
     * @type {ReturnType<typeof storage>|null}
     */
    let user = null;

        /** 
         * @param {string} userId
         * @return {Promise<void>}  
         * */
    const getInvitation = async (userId) => {
        const invitationList = document.getElementById('invitation-list');
        invitationList.innerHTML = util.spinner(lang.get('loading'));

    };

     /**
        * @returns {void}
        */
       const getSelectedUser = async () => {
           const userId = document.getElementById('user_id');
           var options = "";
           try {
               const res = await request('GET', '/api/user').token(session.getToken()).send();
               if (res.code !== 200) {
                   throw new Error('failed to get user.');
               }
               // Assuming res.data is an object for single user
               options += `<option selected>Pilih user</option>`;
               options += `<option value="${res.data.id}">${res.data.name}</option>`;
               userId.innerHTML = options;
               // Initialize Select2 after setting options
               if (window.$ && window.$.fn.select2) {
                   $('#user_id').select2({ 
                       width: '100%',
                       containerCssClass: 'rounded-4 shadow-sm'
                   });
               }
           } catch (err) {
               util.notify(err).error();
           }
       };


       /**
        * @param {HTMLButtonElement} button
        * @returns {Promise<void>}
        */
       const saveInvitation = async (button) => {
           const btn = util.disableButton(button);

           try {
               const formDataRequest = dto.invitationRequest(
                    util.getValue('user_id'),
                    util.getValue('groom_name'),
                    util.getValue('groom_child_order'),
                    util.getValue('groom_father_name'),
                    util.getValue('groom_mother_name'),
                    util.getValue('bride_name'),
                    util.getValue('bride_child_order'),
                    util.getValue('bride_father_name'),
                    util.getValue('bride_mother_name'),
                    util.getValue('wedding_date'),
                    util.getValue('akad_time'),
                    util.getValue('reception_time'),
                    util.getValue('location_map'),
                    util.getValue('address'),
                    util.getValue('slug'),
                    util.getValue('music_url'),
                    util.getValue('cover_image_url')
                );
               const res = await request(HTTP_POST, '/api/v2/invitation')
                   .token(session.getToken())
                   .body(formDataRequest)
                   .send();

               if (res.code !== 201 && res.code !== 200) {
                   throw new Error(res.message || 'Failed to save invitation');
               }

               util.notify('Invitation saved successfully').success();
           } catch (err) {
               console.error(err);
               util.notify(err.message || err).error();
           } finally {
               btn.restore();
           }
       };

      /**
     * @returns {void}
     */
    const init = () => {
    
        getSelectedUser();


    };

    return {
        init,
        getInvitation,
        saveInvitation
    };


})();