<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('uid')->unique();
            $table->unsignedBigInteger('hallId');
            $table->foreign('hallId')->references('id')->on('halls')->onUpdate('cascade')->onDelete('cascade');
            $table->unsignedBigInteger('movieId');
            $table->foreign('movieId')->references('id')->on('movies')->onUpdate('cascade')->onDelete('cascade');
            $table->string('time');
            $table->string('date');
            $table->integer('totalPrice');
            $table->json('seats');
            $table->longText('qr')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tickets');
    }
};
