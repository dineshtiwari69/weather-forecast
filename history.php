<?php


    function generateSqlQueryFromResponse($response){
        $city_name = $response[0]->name;
        $temperature = $response[0]->main->temp;
        $feels_like = $response[0]->main->feels_like;
        $temp_min = $response[0]->main->temp_min;
        $temp_max = $response[0]->main->temp_max;
        $pressure = $response[0]->main->pressure;
        $humidity = $response[0]->main->humidity;
        $visibility = $response[0]->visibility;
        $wind_speed = $response[0]->wind->speed;
        $wind_deg = $response[0]->wind->deg;
        $cloudiness = $response[0]->clouds->all;
        $weather_id = $response[0]->weather[0]->id;
        $weather_main = $response[0]->weather[0]->main;
        $weather_description = $response[0]->weather[0]->description;
        $weather_icon = $response[0]->weather[0]->icon;
        $dt = $response[0]->dt;
        $sys_country = $response[0]->sys->country;
        $sys_sunrise = $response[0]->sys->sunrise;
        $sys_sunset = $response[0]->sys->sunset;
        $timezone = $response[0]->timezone;
        $api_id = $response[0]->id;
        $cod = $response[0]->cod;
        $last_updated = date("Y-m-d H:i:s");

        $sql_query_values = "VALUES ('".$city_name."',".$temperature.",".$feels_like.",".$temp_min.",".$temp_max.",".$pressure.",".$humidity.",".$visibility.",".$wind_speed.",".$wind_deg.",".$cloudiness.",".$weather_id.",'".$weather_main."','".$weather_description."','".$weather_icon."',".$dt.",'".$sys_country."',".$sys_sunrise.",".$sys_sunset.",".$timezone.",".$api_id.",".$cod.",'".$last_updated."')";
        $sql_query = "INSERT INTO weather_data (city_name, temperature, feels_like, temp_min, temp_max, pressure, humidity, visibility, wind_speed, wind_deg, cloudiness, weather_id, weather_main, weather_description, weather_icon, dt, sys_country, sys_sunrise, sys_sunset, timezone, api_id, cod, last_updated) ".$sql_query_values;
        return $sql_query;
    }
    function mapToDesiredFormat($data) {
        $mappedData = array();
        foreach ($data as $item) {
            $mappedItem = array(
                "coord" => array("lon" => 85.3167, "lat" => 27.7167),
                "weather" => array(
                    array(
                        "id" => $item['weather_id'],
                        "main" => $item['weather_main'],
                        "description" => $item['weather_description'],
                        "icon" => $item['weather_icon']
                    )
                ),
                "base" => "stations",
                "main" => array(
                    "temp" => $item['temperature'],
                    "feels_like" => $item['feels_like'],
                    "temp_min" => $item['temp_min'],
                    "temp_max" => $item['temp_max'],
                    "pressure" => $item['pressure'],
                    "humidity" => $item['humidity']
                ),
                "visibility" => $item['visibility'],
                "wind" => array(
                    "speed" => $item['wind_speed'],
                    "deg" => $item['wind_deg']
                ),
                "clouds" => array("all" => $item['cloudiness']),
                "dt" => $item['dt'],
                "sys" => array(
                    "type" => $item['sys_type'],
                    "id" => $item['sys_id'],
                    "country" => $item['sys_country'],
                    "sunrise" => $item['sys_sunrise'],
                    "sunset" => $item['sys_sunset']
                ),
                "timezone" => $item['timezone'],
                "id" => $item['api_id'],
                "name" => $item['city_name'],
                "cod" => $item['cod'],
                "last_updated" => $item['last_updated']
            );
            $mappedData[] = $mappedItem;
        }
        return $mappedData;
    }
    
  

    $city = $_GET['city'];  

    $host = "localhost";
    $username = "root";
    $password = ""; 
    $database = "weather_app"; 
    $port = "3307"; 

    // Create a connection to the database
    $conn = new mysqli($host, $username, $password, $database,$port);

    // Check the connection
    if ($conn->connect_error) {
        $response = array(
            "success" => false,
            "message" => "Connection failed: " . $conn->connect_error
        );
        header('Content-Type: application/json');
        echo json_encode($response);

        
        exit();
    }

  

    $sql = "SELECT * FROM weather_data WHERE (last_updated, DATE(last_updated)) IN ( SELECT MAX(last_updated), DATE(last_updated) FROM weather_data WHERE last_updated BETWEEN DATE_SUB(NOW(), INTERVAL 7 DAY) AND NOW() AND city_name = '".$city."' GROUP BY DATE(last_updated) ) ORDER BY last_updated DESC;";

    $result = $conn->query($sql);

    $listOfResponses = array();

    if ($result->num_rows > 0) {
       
        while($row = $result->fetch_assoc()) {
            $response = array($row);
            $response = mapToDesiredFormat($response);
            $listOfResponses[] = $response[0];
        }

        echo json_encode($listOfResponses);
        header('Content-Type: application/json');
        exit();

    }

    
    else{
        $response = array([]);
        echo json_encode($response);
        exit();

    }
        
        




    
    
 

?>
