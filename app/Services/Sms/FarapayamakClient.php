<?php

namespace App\Services\Sms;

use Exception;

class FarapayamakClient
{
    private const ENDPOINT = 'https://rest.payamak-panel.com/api/SendSMS/';
    private const ENDPOINT_SMART = 'https://rest.payamak-panel.com/api/SmartSMS/';

    public function __construct(
        private readonly string $username,
        private readonly string $password,
        private readonly bool $verifySsl = true,
    ) {
    }

    /**
     * @param  array<string, mixed>  $data
     *
     * @return array<string, mixed>
     */
    private function post(string $route, array $data): array
    {
        $endpoint = self::ENDPOINT;

        if (str_contains($route, 'SmartSMS')) {
            $endpoint = str_replace('SendSMS/', '', self::ENDPOINT);
        }

        $curl = curl_init();

        curl_setopt_array($curl, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_URL => $endpoint.$route,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => http_build_query($data),
            CURLOPT_SSL_VERIFYPEER => $this->verifySsl,
        ]);

        $response = curl_exec($curl);

        if ($response === false) {
            $error = curl_error($curl);
            curl_close($curl);

            throw new Exception($error);
        }

        curl_close($curl);

        $decoded = json_decode($response, true);

        return is_array($decoded) ? $decoded : [];
    }

    /**
     * @param  array<string, mixed>  $data
     *
     * @return array<string, mixed>
     */
    private function postAsJson(string $route, array $data): array
    {
        $curl = curl_init();

        curl_setopt_array($curl, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_URL => self::ENDPOINT_SMART.$route,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => json_encode($data, JSON_UNESCAPED_UNICODE),
            CURLOPT_SSL_VERIFYPEER => $this->verifySsl,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        ]);

        $response = curl_exec($curl);

        if ($response === false) {
            $error = curl_error($curl);
            curl_close($curl);

            throw new Exception($error);
        }

        curl_close($curl);

        $decoded = json_decode($response, true);

        return is_array($decoded) ? $decoded : [];
    }

    /**
     * @return array<string, mixed>
     */
    public function SendSMS(string $to, string $from, string $text, bool $isFlash = false): array
    {
        $data = [
            'to' => $to,
            'from' => $from,
            'text' => $text,
            'isFlash' => $isFlash,
            'username' => $this->username,
            'password' => $this->password,
        ];

        return $this->post('SendSMS', $data);
    }

    /**
     * @return array<string, mixed>
     */
    public function GetDeliveries2(string $recId): array
    {
        $data = [
            'recID' => $recId,
            'username' => $this->username,
            'password' => $this->password,
        ];

        return $this->post('GetDeliveries2', $data);
    }

    /**
     * @return array<string, mixed>
     */
    public function GetMessages(string $location, string $from, int $index, int $count): array
    {
        $data = [
            'location' => $location,
            'from' => $from,
            'index' => $index,
            'count' => $count,
            'username' => $this->username,
            'password' => $this->password,
        ];

        return $this->post('GetMessages', $data);
    }

    /**
     * @return array<string, mixed>
     */
    public function GetCredit(): array
    {
        $data = [
            'username' => $this->username,
            'password' => $this->password,
        ];

        return $this->post('GetCredit', $data);
    }

    /**
     * @return array<string, mixed>
     */
    public function GetBasePrice(): array
    {
        $data = [
            'username' => $this->username,
            'password' => $this->password,
        ];

        return $this->post('GetBasePrice', $data);
    }

    /**
     * @return array<string, mixed>
     */
    public function GetUserNumbers(): array
    {
        $data = [
            'username' => $this->username,
            'password' => $this->password,
        ];

        return $this->post('GetUserNumbers', $data);
    }

    /**
     * @return array<string, mixed>
     */
    public function BaseServiceNumber(string $text, string $to, string $bodyId): array
    {
        $data = [
            'text' => $text,
            'to' => $to,
            'bodyId' => $bodyId,
            'username' => $this->username,
            'password' => $this->password,
        ];

        return $this->post('BaseServiceNumber', $data);
    }

    /**
     * @return array<string, mixed>
     */
    public function SendSmartSMS(string $to, string $text, string $from, string $fromSupportOne, string $fromSupportTwo): array
    {
        $data = [
            'to' => $to,
            'text' => $text,
            'from' => $from,
            'fromSupportOne' => $fromSupportOne,
            'fromSupportTwo' => $fromSupportTwo,
            'username' => $this->username,
            'password' => $this->password,
        ];

        return $this->post('SmartSMS/Send', $data);
    }

    /**
     * @return array<string, mixed>
     */
    public function SendMultipleSmartSMS(string $to, string $text, string $from, string $fromSupportOne, string $fromSupportTwo): array
    {
        $data = [
            'to' => $to,
            'text' => $text,
            'from' => $from,
            'fromSupportOne' => $fromSupportOne,
            'fromSupportTwo' => $fromSupportTwo,
            'username' => $this->username,
            'password' => $this->password,
        ];

        return $this->postAsJson('SendMultiple', $data);
    }

    /**
     * @return array<string, mixed>
     */
    public function GetSmartSMSDeliveries2(string $id): array
    {
        $data = [
            'Id' => $id,
            'username' => $this->username,
            'password' => $this->password,
        ];

        return $this->post('SmartSMS/GetDeliveries2', $data);
    }

    /**
     * @return array<string, mixed>
     */
    public function GetSmartSMSDeliveries(string $ids): array
    {
        $data = [
            'Ids' => $ids,
            'username' => $this->username,
            'password' => $this->password,
        ];

        return $this->postAsJson('GetDeliveries', $data);
    }
}

