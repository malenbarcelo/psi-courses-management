window.addEventListener('load',async()=>{

    for (let i = 0; i < 10; i++) {
        const itemsMenu = document.getElementById('itemsMenu_' + i)
        const subItems = document.getElementById('subItems_' + i)
        if (itemsMenu && subItems) {
            itemsMenu.addEventListener("mouseover",async(e)=>{
                subItems.style.display = "flex"
            })
            itemsMenu.addEventListener("mouseleave",async(e)=>{
                subItems.style.display = "none"
            })
        }
    }
})




