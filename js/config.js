define([], function () {
  'use strict';
    return {
		DEBUG : true,
		DEBUG_LEVEL : 2, // 0 - no logs, 1 - error logs, 2 - warn logs, 3 - info logs
		LOCAL : true,
		app : {
			mainContainerSelector : "#view.main-container",
			mainWrapperSelector : ".main"
		},
		defaultProviderURL: "http://10.5.6.83:6002/",
		KeySets: {
            "local": [
                { 
                	name : "PressOK",
                	code : 13
                },
                { 
                	name : "move_up",
                	code : 38
                },
                { 
                	name : "move_down",
                	code : 40
                },
                { 
                	name : "move_left",
                	code : 37
                },
                { 
                	name : "second_event_for_left_key_example",
                	code : 37
                },
                { 
                	name : "move_right",
                	code : 39
                },
                { 
                	name : "BtnKey1",
                	code : 49
                },
                { 
                	name : "BtnKey2",
                	code : 50
                },
                { 
                	name : "BtnKey3",
                	code : 51
                },
                { 
                	name : "BtnKey4",
                	code : 52
                },
                { 
                	name : "BtnKey5",
                	code : 53
                },
                { 
                	name : "BtnKey6",
                	code : 54
                },
                { 
                	name : "BtnKey7",
                	code : 55
                },
                { 
                	name : "BtnKey8",
                	code : 56
                },
                { 
                	name : "BtnKey9",
                	code : 57
                },
                { 
                	name : "BtnKey0",
                	code : 48
                },
                { 
                	name : "BtnKeyDot",
                	code :190
                }
            ]
        }
	};
});