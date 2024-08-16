const bottomHeaderMenu = [
    {
        id:1,
        name:'EVENTOS',
        href:'/courses/events',
        subitems:[],
        idsUsersCategories:[1,2,3,4]
    },
    {
        id:2,
        name:'CURSOS',
        href:'/courses',
        subitems:[],
        idsUsersCategories:[1,2,3]
    },
    {
        id:3,
        name:'COTIZACIONES',
        href:'/quotations',
        subitems:[
            {'subitem':'EN CURSO', 'href':'/quotations'},
            {'subitem':'HISTORIAL', 'href':'/quotations/quotes-history'}
        ],
        idsUsersCategories:[1,2,3,4]
    },

    {
        id:4,
        name:'USUARIOS',
        href:'/users',
        subitems:[],
        idsUsersCategories:[1,2,3]
    },
]

module.exports = bottomHeaderMenu