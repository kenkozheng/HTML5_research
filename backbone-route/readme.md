<script src="libs/backbone-route.js"></script>
<script>

    Route.init({
        'module1': function(){
            console.log(1);
        },
        'module2/:name/:age': function(){
            console.log(2, arguments);
        },
        'module3(/:name)(/:age)': function(){
            console.log('3', arguments);
        },
        '*': function(){
            console.log(404);
        }
    });
</script>


url£º
index.html#module2