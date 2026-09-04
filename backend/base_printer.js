
class BasePrinter { //template method
    SEPARATOR = ' '

    log(words) {
        for (let word of words) {
            console.log(word);
            console.log(this.SEPARATOR)
        }
    }
}


class UnderscorePrinter extends BasePrinter {
    SEPARATOR = '_'
}

class AmpersantPrinter extends BasePrinter {
    SEPARATOR = '&'
}


const printer = new UnderscorePrinter();
printer.log(['abc', 'qwe', 'asd'])