// RUN //

$(document).ready(function() {
	$( 'input[name="mass-units"]' ).change(function(){
		updateMassUnits();
		calculate();
	});
	$( 'input[name="energy-units"]' ).change(function(){
		updateEnergyUnits();
		calculate();
	});
	$( 'input[name="gender"]' ).change(function(){
		updateGender();
		calculate();
	});
	$( 'input[type="text"]' ).keyup(function(){
		updateInputs();
		calculate();
	});
	$( '#activity' ).change(function(){
		rangeSlider();
		calculate();
	});
	$( 'input[name="formula"]' ).change(function(){
		formulaOptions();
		statsView();
		calculate();
	});
});


$massUnits = "KGS";
$energyUnits = "CAL";
$gender = "male";
$activityQuantifier = 1.55;
$formula = "total-bodyweight";

$height = "";
$weight = "";
$age = "";
$bodyFat = "0";

$massFactor = 2.2046226218488;
$measurementFactor = 0.393701;


function updateMassUnits() {
	$unit = $("input[name='mass-units']:checked").val();
	if ($unit === "metric") {
		$massUnits = "KGS";
		$("#height + label").text("CMS");
		$("#weight + label").text($massUnits);
		$height = parseFloat(Math.round($("#height").val() / $measurementFactor));
		if ($height <= 0) {
			$height = "";
		};
		$("#height").val($height);
		$weight = parseFloat(Math.round($("#weight").val() / $massFactor));
		if ($weight <= 0) {
			$weight = "";
		};
		$("#weight").val($weight);
	} else {
		$massUnits = "LBS";
		$("#height + label").text("IN");
		$("#weight + label").text($massUnits);
		$height = parseFloat(Math.round($("#height").val() * $measurementFactor));
		if ($height <= 0) {
			$height = "";
		};
		$("#height").val($height);
		$weight = parseFloat(Math.round($("#weight").val() * $massFactor));
		if ($weight <= 0) {
			$weight = "";
		};
		$("#weight").val($weight);
	};
};

function updateEnergyUnits() {
	$unit = $("input[name='energy-units']:checked").val();
	if ($unit === "calories") {
		$energyUnits = "CAL";
	} else {
		$energyUnits = "KJ";
	};
};

function updateGender() {
	$gender = $("input[name='gender']:checked").val();
	if ($gender === "male") {
		$(".stats-wrapper .title").css('background-color','#2980b9');
	} else if ($gender === "female") {
		$(".stats-wrapper .title").css('background-color','#940094');
	};
};

function updateInputs() {
	$height = $("#height").val();
	$weight = $("#weight").val();
	$age = $("#age").val();
	$bodyFat = $("#body-fat").val();
};

function rangeSlider() {
	$activityLevel = $( "#activity" ).val();
	switch($activityLevel) {
		case '0':
			$activityQuantifier = 1.2;
			$activityName = "Sedentary";
			$activityBlurb = "little or no exercise";
			break;
		case '1':
			$activityQuantifier = 1.375;
			$activityName = "Light";
			$activityBlurb = "exercise/sports 1-3 days per week";
			break;
		case '2':
			$activityQuantifier = 1.55;
			$activityName = "Moderate";
			$activityBlurb = "exercise/sports 3-5 days per week";
			break;
		case '3':
			$activityQuantifier = 1.725;
			$activityName = "High";
			$activityBlurb = "exercise/sports 6-7 days a week";
			break;
		case '4':
			$activityQuantifier = 1.9;
			$activityName = "Extreme";
			$activityBlurb = "exercise/sports multiple times a day";
			break;
	};
	$( ".details li:first-of-type" ).text($activityName);
	$( ".details li:last-of-type" ).text("TDEE x" + $activityQuantifier);
	$( ".details + p" ).html("<b>"+$activityName+":</b> "+$activityBlurb);
};

function formulaOptions() {
	$title = $( ".select .sub-block h2" );
	$formula = $("input[name='formula']:checked").val();
	$bfInput = $('#body-fat');
	if ($formula === 'lean-mass') {
    	$title.css('color', '#343a41');
    	$bfInput.prop( "disabled", false );
    	$(".select .text input").css('color','#343a41');
    } else {
    	$title.css('color', '#a9a9a9');
    	$bfInput.prop( "disabled", true );
    	$(".select .text input").css('color','#a9a9a9');
    };
};

function statsView() {
	$formula = $("input[name='formula']:checked").val();
	if ($formula === 'lean-mass') {
    	$(".stats ul").css('display','block');
    } else {
    	$(".stats-bodyfat").css('display','none');
    	$(".stats-bfmass").css('display','none');
    	$(".stats-lbmass").css('display','none');
    	$(".stats-mincal").css('display','none');
    	$(".stats-fmetabolism").css('display','none');
    };
};



//outputs
$outputBodyweight = "";
$outputBodyfat = "";
$outputBmi = "";
$outputBmr = "";
$outputTdee = "";
$outputLbmass = "";
$outputBfmass = "";
$outputMincal = "";
$outputFmetabolism = "";

function resetOutputs() {
	$outputBodyweight = "";
	$outputBodyfat = "";
	$outputBmi = "";
	$outputBmr = "";
	$outputTdee = "";
	$outputLbmass = "";
	$outputBfmass = "";
	$outputMincal = "";
	$outputFmetabolism = "";
}


function calculate() {
	resetOutputs();
	outputBodyweight();
	outputBodyfat();
	outputBmi();
	outputBodyMass();
	outputBmr();
	outputTdee();
	outputFmetabolism();
}

//basic calcs
function outputBodyweight() {
	if ($weight > 0) {
		$outputBodyweight = $weight + " " + $massUnits;
	}
	$(".stats-weight li:last-of-type").text($outputBodyweight);
}
function outputBodyfat() {
	if ($bodyFat > 0) {
		$outputBodyfat = $bodyFat + " %BF";
	}
	$(".stats-bodyfat li:last-of-type").text($outputBodyfat);
}
function outputBmi() {
	if ($weight > 0 && $height > 0) {
		if ($massUnits === "LBS") {
			$outputBmi = ((($weight / $massFactor) / (($height / $measurementFactor)/100)) / (($height / $measurementFactor)/100)).toFixed(1);
		} else {
			$outputBmi = (($weight / ($height/100)) / ($height/100)).toFixed(1);
		};
	};
	$(".stats-bmi li:last-of-type").text($outputBmi);
}
function outputBodyMass() {
	if ($bodyFat > 0 && $weight > 0) {
		$outputLbmass = ($weight - ($bodyFat / 100 * $weight)).toFixed(1) + " " + $massUnits;
		$outputBfmass = ($bodyFat / 100 * $weight).toFixed(1) + " " + $massUnits;
	}
	$(".stats-lbmass li:last-of-type").text($outputLbmass);
	$(".stats-bfmass li:last-of-type").text($outputBfmass);
}
function outputBmr() {
	if ($formula === "total-bodyweight") {
		if ($weight > 0 && $height > 0 && $age > 0) {
			if ($massUnits === "LBS") {
				$outputBmr = Math.round((($weight / $massFactor) * 10) + (($height / $measurementFactor) * 6.25) - ($age * 5) + 5);
			} else {
				$outputBmr = Math.round(($weight * 10) + ($height * 6.25) - ($age * 5) + 5);
			};
			if ($gender === "female") {
				$outputBmr -= 166;
			}
			if ($energyUnits === "KJ") {
				$outputBmr = Math.round($outputBmr * 4.184);
			};
			$outputBmr += " " + $energyUnits;
		}
	} else {
		if ($weight > 0 && $height > 0 && $bodyFat > 0) {
			if ($massUnits === "LBS") {
				$outputBmr = Math.round(21.6 * ($weight / $massFactor) + 370);
			} else {
				$outputBmr = Math.round(21.6 * ($weight - ($bodyFat / 100 * $weight)) + 370);
			};
			if ($energyUnits === "KJ") {
				$outputBmr = Math.round($outputBmr * 4.184);
			};
			$outputBmr += " " + $energyUnits;
		}
	}
	$(".stats-bmr li:last-of-type").text($outputBmr);
}
function outputTdee() {
	if ($outputBmr != "") {
		if ($energyUnits == "KJ") {
			$outputTdee = $outputBmr.substring(0, $outputBmr.length -3);
		} else {
			$outputTdee = $outputBmr.substring(0, $outputBmr.length -4);
		}
		$outputTdee = Math.round($outputTdee * $activityQuantifier) + " " + $energyUnits;
	};
	$(".stats-tdee li:last-of-type").text($outputTdee);
}
function outputFmetabolism() {
	if ($outputBmr != "") {
		if ($energyUnits === "KJ") {
			$outputFmetabolism = Math.round((($bodyFat / 100 * $weight) * 66.1386)  * 4.184);
		} else {
			$outputFmetabolism = Math.round(($bodyFat / 100 * $weight) * 66.1386);
		}
		$outputFmetabolism  += " " + $energyUnits;
	}
	$(".stats-fmetabolism li:last-of-type").text($outputFmetabolism);
}
