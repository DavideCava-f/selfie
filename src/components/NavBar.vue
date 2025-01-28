<script setup>

</script>


<template>
   <nav class="navbar navbar-expand-lg navbar-dark bg-danger">
        <div class="container-fluid">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="nav m1-auto onRight">
                    <li class="nav-item">
                        <RouterLink class="nav-link active" to="/home">Home</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/note">Notes</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="#">Projects</RouterLink>
                    </li>
                </ul>
            </div>
           <!-- <img src="https://dummyimage.com/100x100/ff0000/000000.png&text=USSR" width="40px">-->
        </div>
    </nav>
</template>

<style scoped>
.onRight{
    justify-content: center;
   


}
</style>