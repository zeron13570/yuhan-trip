<script>
    import Router from "svelte-spa-router";
    import TravelLogDetail from "./routes/travelLogDetail/[id].svelte";
    
    const routes = {
      "/travelLogDetail/:id": TravelLogDetail,
      // 다른 경로를 필요에 따라 추가
    };
  </script>
  
  <Router {routes} />