import React from "react"
import {Form,Button,Container, Row, Col, DropdownButton,Dropdown} from 'react-bootstrap'

function RequestsPage()
{
    return (
        <Form>
        <Form.Row>
            <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Request sent to</Form.Label>
            <Form.Control as="select" defaultValue="Choose...">
            <option>Choose...</option>
            <option>Loaa Elzahar</option>
            <option>Walid ElHefny</option>
            </Form.Control>
            </Form.Group>
        </Form.Row>
        <Form.Row>
        <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Slot for which a replacement is need</Form.Label>
            <Form.Control as="select" defaultValue="Choose...">
            <option>Choose...</option>
            <option>Sunday 11:45 PM-1:15 PM</option>
            <option>Sunday 1:45 PM-3:15 PM</option>
            <option>Tuesday 3:45 PM-5:15 PM</option>
            <option>Wednesday 8:15 PM-9:45 PM</option>
            </Form.Control>
        </Form.Group>
        </Form.Row>
        <Form.Row>
            <Form.Group as={Col} controlId="formGridCity">
            <Form.Label>Date of Replacement</Form.Label>
            <Form.Control as="select" defaultValue="Choose...">
            <option>Choose Month...</option>
            <option>January</option>
            <option>Febuary</option>
            <option>March</option>
            <option>April</option>
            <option>May</option>
            <option>June</option>
            <option>July</option>
            <option>August</option>
            <option>September</option>
            <option>October</option>
            <option>November</option>
            <option>December</option>
            </Form.Control>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridState">
            <Form.Label> d</Form.Label>
            <Form.Control as="select" defaultValue="Choose...">
            <option>Choose Day...</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
            <option>7</option>
            <option>8</option>
            <option>9</option>
            <option>10</option>
            <option>11</option>
            <option>12</option>
            <option>13</option>
            <option>14</option>
            <option>15</option>
            <option>16</option>
            <option>17</option>
            <option>18</option>
            <option>19</option>
            <option>20</option>
            <option>21</option>
            <option>22</option>
            <option>23</option>
            <option>24</option>
            <option>25</option>
            <option>26</option>
            <option>27</option>
            <option>28</option>
            <option>29</option>
            <option>30</option>
            <option>31</option>
            </Form.Control>
            </Form.Group>
        </Form.Row>

        <Button variant="primary" type="submit">
            Submit
        </Button>
        </Form>);
}
export default RequestsPage