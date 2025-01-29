<script setup>

</script>


<template>
    <div class="container bg-danger" >
        <div class="row">
            <div class="col-1">
                <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#navbar" aria-expanded="false" aria-controls="collapseWidthExample">
                    T
                </button>
            </div>

            <div class="col-9">
                <div class="collapse collapse-horizontal" id="navbar">
                    <ul class="nav" style="width: 350px;">
                        <li class="nav-item">
                            <RouterLink class="nav-link active" to="/home">Home</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link" to="/note">Notes</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link" to="#">Projects</RouterLink>
                        </li>
                        <li>
                            <RouterLink class="nav-link" to="#"><img src="https://dummyimage.com/600x400/000/fff&text=P" width="20px"></RouterLink>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="col-2">
                <img src="https://dummyimage.com/100x100/ff0000/000000.png&text=USSR" width="40px">
            </div>
        </div>
    </div>
</template>

<style scoped>
.onRight{
    justify-content: center;
}


</style>