function(instance, properties, context) {

    $(document).ready(function() {

        var optionSelected = properties.formatType;

        // Get arrays from Custom Format, Date Format and Delimiters properties. customArray uses JSON.parse because .split results in an array of strings rather than integers, and the cleave.js blocks property needs integers

        var customArray = JSON.parse("[" + properties.customformat + "]");
        var dateArray = properties.dateformat.split(",");
        var delimitersArray = properties.delimiter.split("/,/");
        
        if(properties.only_letters) {
        	document.querySelector("#" + properties.inputID).addEventListener('input', function() {
      		var inputValue = this.value;
      		var filteredValue = inputValue.replace(/\d/g, '');
      		this.value = filteredValue;
    		});
        }

        switch (optionSelected) {
            case "Credit card":
                var cleave = new Cleave('#' + properties.inputID, {
                    creditCard: true,
                    delimiters: delimitersArray,
                    prefix: properties.prefix,
                });

                break;
            case "Date":
                var cleave = new Cleave('#' + properties.inputID, {
                    date: true,
                    datePattern: dateArray,
                    delimiters: delimitersArray,
                    prefix: properties.prefix,
                });

                break;
            case "Thousands":
                var cleave = new Cleave('#' + properties.inputID, {
                    numeral: true,
                    numeralThousandsGroupStyle: 'thousand',
                    delimiters: delimitersArray,
                    prefix: properties.prefix,
                });

                break;
            case "Custom":
                var sanitizedValue
                var cleave = new Cleave('#' + properties.inputID, {
                    delimiters: delimitersArray,
                    blocks: customArray,
                    prefix: properties.prefix,
                    uppercase: properties.uppercase,
                    lowercase: properties.lowercase,
                    numericOnly: false,
                });
                

                break;
        }



        if (properties.rawdefaultvalue) {
            cleave.setRawValue(properties.rawdefaultvalue);
        };




        // When input changes, set rawInput

        $("#" + properties.inputID).change(function() {
            var rawinput = cleave.getRawValue();
            instance.publishState('rawinput', rawinput);
            

            // Also convert to number and set rawInputNumber
            // Regex to strip non-numeric characters (except decimal point.) I tried using parsefloat, but when there are non-numeric characters, Bubble throws a weird error: Expected a number but got a number (?!?). Not sure what's going on there. This is probably also faster.

            var rawFloat = rawinput.replace(/[^\d.-]/g, '');
            if (rawFloat) {
                instance.publishState('rawinputnumber', rawFloat);
            } else {
                instance.publishState('rawinputnumber', null);
            }
        });
		

    });


}