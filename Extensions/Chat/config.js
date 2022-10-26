// eslint-disable-next-line no-unused-vars
module.exports = {
    /**
     * Proximity is exactly what it say, it turns chat into a proximity based chat
     * the distanst needed for players to be able to communicate is the Radious.
     *
     * Setting Enabled to false will turn this feature off, where everyone can see anyone's message
     * regardless of distance.
     */
    Proximity: {
        Enabled: true, // self-explainatory
        Radius: 60 // This is in GTA units; I think..
    },
    /**
     * The message template; change it to what you want it to looks like
     * available variables;
     * [role, name, id, message]
     * NOTE: it must be in between cruly-brackets
     */
    Template: [ '{role} ^0^r| {name} | {id} : ', '{message}' ],
    DefaultRole: '^8^*Civilian^r', // The default chat role
    /**
     * Roles is an object that contains all chat roles with their
     * corresponding name, the role name does not have to be the same as discord role name
     *
     * You can also include Discord users' IDs if you think you have someone special,
     * just put their Discord user ID instead of the Role ID.
     *
     * ROLE TMEPLATE:    'ROLE ID': 'ROLE NAME'
     * USER TMEPLATE:    'USER ID': 'ROLE NAME'
     *
     * Examples below
     */
    Roles: {
        // ItsAmamrB    (A special person)
        '357842475328733186': '^0^*Mr. Snow^r',
        // JamesV       (Also a special person)
        '199406317520027648': '^9^*The Big Kahuna^r',

        // JCRP Owner
        '739978732877512776': '^1^*Community Command^r',

        // JCRP Staff Team
        '652990957611909120': '^5^*Senior Administrator^r',
        '652990958102904835': '^5^*Administrator^r',
        '652990958333460522': '^5^*Junior Administrator^r',

        // San Andreas Highway Patrol
        '652990999022534676': '^3^*SAHP Commissioner^r',
        '652990999634903070': '^3^*SAHP Deputy Commissioner^r',
        '831657433599967262': '^3^*SAHP Assistant Commissioner^r',
        '652991000586747907': '^3^*SAHP Chief^r',
        '831657754225147958': '^3^*SAHP Assistant Chief^r',
        '652991002600013864': '^3^*SAHP Captain^r',
        '652991003866955786': '^3^*SAHP Lieutenant^r',
        '652991005175578664': '^3^*SASP Sergeant^r',
        '705926146939945051': '^3^*SAHP Senior Officer^r',
        '652991008493142066': '^3^*SAHP Officer^r',
        '706648246948331650': '^3^*SAHP Cadet^r',
        '652991008765771777': '^3^*SAHP Reserve Officer^r',

        // Los Santos Sheriff's Department
        '652990981687214081': '^2^*LSSD Sheriff^r',
        '652990982526074890': '^2^*LSSD Undersheriff^r',
        '652990983532969994': '^2^*LSSD Asst. Sheriff^r',
        '709249425658085396': '^2^*LSSD Commander^r',
        '652990985638510655': '^2^*LSSD Captain^r',
        '652990986242228244': '^2^*LSSD Lieutenant^r',
        '652990986880024596': '^2^*LSSD Sergeant^r',
        '751313825365753898': '^2^*LSSD Corporal^r',
        '652990988079333397': '^2^*LSSD Sr. Deputy^r',
        '652990988637306881': '^2^*LSSD Deputy^r',
        '652990990436663347': '^2^*LSSD Reserve Deputy^r',
        '652990989580894208': '^2^*LSSD Prob. Deputy^r',

        // Los Santos Police Department
        '652990969108496394': '^4^*LSPD Chief of Police^r',
        '652990969351897109': '^4^*LSPD Assistant Chief^r',
        '652990970421313536': '^4^*LSPD Deputy Chief^r',
        '683052312863703041': '^4^*LSPD Police Commander^r',
        '652990971646312458': '^4^*LSPD Police Captain III^r',
        '683052312595660821': '^4^*LSPD Police Captain II^r',
        '652990972871049246': '^4^*LSPD Police Captain I^r',
        '726075934142234705': '^4^*LSPD Police Lieutenant II^r',
        '652990974074683392': '^4^*LSPD Police Lieutenant I^r',
        '726082776687706132': '^4^*LSPD Police Sergeant III^r',
        '726080618798252082': '^4^*LSPD Police Sergeant II^r',
        '652990975685165075': '^4^*LSPD Police Sergeant I^r',
        '726082068215234630': '^4^*LSPD Police Detective II^r',
        '662140964806328353': '^4^*LSPD Police Detective I^r',
        '734160878425079931': '^4^*LSPD Police Officer III+1^r',
        '652990976285212676': '^4^*LSPD Police Officer III^r',
        '652990976977141790': '^4^*LSPD Police Officer II^r',
        '652990977388183593': '^4^*LSPD Police Officer I^r',
        '773582734449836053': '^4^*LSPD Reserve Officer^r',
        '671055383938203648': '^4^*LSPD Academy Student^r',

        // San Andreas Fire Rescue
        '652991015187251201': '^1^*SAFR Chief^r',
        '652991016151941120': '^1^*SAFR Deputy Chief^r',
        '652991016764178463': '^1^*SAFR Assistant Chief^r',
        '652991017557164052': '^1^*SAFR District Chief^r',
        '750736609221148742': '^1^*SAFR Battalion Commander^r',
        '652991018161143868': '^1^*SAFR Battalion Chief^r',
        '652991018744020992': '^1^*SAFR Captain^r',
        '652991020740509706': '^1^*SAFR Lieutenant^r',
        '652991023160754197': '^1^*SAFR Firefighter^r',
        '652991023580184608': '^1^*SAFR Probationary Firefighter^r',
        '652991024268050433': '^1^*SAFR Volunteer Firefighter^r',

        // JCRP Donators
        '652991043989536810': '^8^*JCRP Donator^r',

        // Nitro Booster
        '581644688138960897': '^8^*Nitro Booster^r',

        // JCRP Civilian Operations
        '652991045189107753': '^8^*CO | Director^r',
        '652991046011191315': '^8^*CO | Co-Director^r',
        '652991046892126208': '^8^*CO | Assistant Director^r',
        '652991047634386944': '^8^*CO | Executive^r',
        '652991048577974282': '^8^*CO | Manager^r',
        '652991049236742144': '^8^*CO | Supervisor^r',
        '652991049483943963': '^8^*CO | Specialist^r',
        '652991050612342785': '^8^*Civilian III^r',
        '652991050960338945': '^8^*Civilian II^r',
        '652991051958845470': '^8^*Civilian I^r'
    }
};

