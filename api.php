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
    function prepareDBWrite(){
        global $conn;
        global $city;
        global $response;
        $url = "https://api.openweathermap.org/data/2.5/weather?q=".$city."&appid=b8471db96386d69f830154b522912014&units=metric";

        $response = @file_get_contents($url);
        if(!$response){
            $response = array(
                "cod" => "404",
                "message" => "city not found"
            );
            header('Content-Type: application/json');
            echo json_encode($response);
            exit();

        }

        $response = json_decode($response);

        $response = array($response);

        $sql_query = generateSqlQueryFromResponse($response);

        $conn -> query($sql_query);

    }

    function dataIsRecent($lastUpdated){
        //check if date in 2023-08-13 09:12:51 format is within 10 minutes
        $lastUpdated = strtotime($lastUpdated);
        $now = strtotime(date("Y-m-d H:i:s"));
        $diff = $now - $lastUpdated;
        if($diff < 600){
            return true;
        }
        return false;
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

  

    $sql = "SELECT * FROM weather_data WHERE city_name = '$city'";

    $result = $conn->query($sql);

   

    if ($result->num_rows > 0) {
       
        while($row = $result->fetch_assoc()) {
            $response = array($row);
            $response = mapToDesiredFormat($response);
        }

        $lastUpdated = $response[0]['last_updated'];

        $response = $response[0];

        


        if(dataIsRecent($lastUpdated)){
           
            $response = array(($response))[0];
            header('Content-Type: application/json');
            echo json_encode($response);
            exit();
            
        } else {




            prepareDBWrite();

            $response = array(($response))[0][0];
            header('Content-Type: application/json');
            echo json_encode($response);
            exit();
        }




    } else {

        
        prepareDBWrite();

        $response = array(($response))[0][0];
        header('Content-Type: application/json');
        echo json_encode($response);
    }

    
 

?>
