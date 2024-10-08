<script setup lang="ts">
</script>

<template>
  <div class="preloader">
    <div class="scene">
      <div class="cube">
        <div class="cube__face front">
          <li style="grid-area: 2 / 2 / 2 / 2;"></li>
        </div>

        <div class="cube__face back">
          <li style="grid-area: 1 / 1 / 1 / 1;"></li>
          <li style="grid-area: 3 / 3 / 3 / 3;"></li>
        </div>

        <div class="cube__face right">
          <li style="grid-area: 1 / 1 / 1 / 1;"></li>
          <li style="grid-area: 3 / 1 / 3 / 1;"></li>
          <li style="grid-area: 2 / 2 / 2 / 2;"></li>
          <li style="grid-area: 1 / 3 / 1 / 3;"></li>
          <li style="grid-area: 3 / 3 / 3 / 3;"></li>
        </div>

        <div class="cube__face left">
          <li style="grid-area: 1 / 1 / 1 / 1;"></li>
          <li style="grid-area: 2 / 1 / 2 / 1;"></li>
          <li style="grid-area: 3 / 1 / 3 / 1;"></li>
          <li style="grid-area: 1 / 3 / 1 / 3;"></li>
          <li style="grid-area: 2 / 3 / 2 / 3;"></li>
          <li style="grid-area: 3 / 3 / 3 / 3;"></li>
        </div>

        <div class="cube__face top">
          <li style="grid-area: 1 / 1 / 1 / 1;"></li>
          <li style="grid-area: 2 / 2 / 2 / 2;"></li>
          <li style="grid-area: 3 / 3 / 3 / 3;"></li>
        </div>

        <div class="cube__face bottom">
          <li style="grid-area: 1 / 1 / 1 / 1;"></li>
          <li style="grid-area: 3 / 1 / 3 / 1;"></li>
          <li style="grid-area: 1 / 3 / 1 / 3;"></li>
          <li style="grid-area: 3 / 3 / 3 / 3;"></li>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@keyframes roll{
    0%, 100% {
        transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
    }
    16% {
        transform: rotateY(-90deg);
    }
    33% {
        transform: rotateY(-90deg) rotateZ(90deg);
    }
    50% {
        transform: rotateY(-180deg) rotateZ(90deg);
    }
    66% {
        transform: rotateY(-270deg) rotateX(90deg);
    }
    83% {
        transform: rotateX(90deg);
    }
}
.preloader {
  width: 100%;
  height: 100%;
  background: #2e0327;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  text-align: center;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;

  >.scene{
    width: 100px;
    height: 100px;
    perspective: 600px;
    transition: 1.5s;

    >.cube{
      width: 100%;
      height: 100%;
      position: relative;
      transform-style: preserve-3d;
      transform: translateZ(-100px);
      /**/animation: roll 8s linear infinite alternate;
    
      >.cube__face {
        display: grid;
        grid-template: repeat(3,45px) / repeat(3,45px);
        border: 1px solid #2e0327;
        background: #4b0e40;
        position: absolute; 
        width: 135px;
        height: 135px;
        font-size: 80px;
        align-items: center;
        justify-items: center;
        padding: 32.5px;

        &.front{
            color:rgb(255, 93, 93);
            transform: rotateY(0deg) translateZ(100px);
        }
        &.back{
            color:rgb(58, 228, 171);
            transform: rotateY(90deg) translateZ(100px);
        }
        &.right{
            color:rgb(3, 173, 3);
            transform: rotateY(-90deg) translateZ(100px);
        }
        &.left{
            color:rgb(193, 61, 245);
            transform: rotateY(180deg) translateZ(100px);
        }
        &.top{
            color:rgb(61, 135, 245);
            transform: rotateX(90deg) translateZ(100px);
        }
        &.bottom{
            color:rgb(221, 191, 55);
            transform: rotateX(-90deg) translateZ(100px);
        }
      }

      .cube__face li {
        width: 25px;
        height: 110px;
        margin: 0;
      }
    }
  }
}
</style>